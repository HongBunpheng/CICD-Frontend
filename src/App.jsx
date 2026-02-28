import React, { useEffect, useMemo, useState } from "react";
import { createOrder, demoProducts, fetchProducts, isApiConfigured } from "./api";
import ProductList from "./components/ProductList.jsx";
import Cart from "./components/Cart.jsx";

function toMoney(value) {
  const num = Number(value || 0);
  return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingProducts(true);
      setProductError("");
      try {
        const data = await fetchProducts();
        if (mounted) setProducts(data || []);
      } catch (err) {
        if (mounted) {
          setProducts(demoProducts);
          setProductError("Backend unreachable — showing demo products.");
        }
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
  }, [cartItems]);

  function addToCart(product) {
    setSuccessMessage("");
    setSubmitError("");
    setCart((prev) => {
      const existing = prev[product.id];
      const quantity = existing ? existing.quantity + 1 : 1;
      return {
        ...prev,
        [product.id]: { product, quantity },
      };
    });
  }

  function increase(productId) {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      return { ...prev, [productId]: { ...item, quantity: item.quantity + 1 } };
    });
  }

  function decrease(productId) {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      const nextQty = item.quantity - 1;
      if (nextQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: { ...item, quantity: nextQty } };
    });
  }

  function remove(productId) {
    setCart((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setSuccessMessage("");
    setSubmitError("");

    if (!customerName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    const payload = {
      customerName: customerName.trim(),
      items: cartItems.map((ci) => ({
        productId: ci.product.id,
        quantity: ci.quantity,
      })),
    };

    try {
      setSubmitting(true);
      const saved = await createOrder(payload);
      setCart({});
      setCustomerName("");
      setSuccessMessage(
        `Order #${saved.id} placed successfully. Total: ${toMoney(saved.totalPrice)}`,
      );
    } catch (err) {
      const message =
        err?.message === "Backend not configured (VITE_API_URL missing)."
          ? "Backend not configured. Set VITE_API_URL in Vercel to enable checkout."
          : "Checkout failed. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <div className="brand-title">Mini E-Commerce</div>
          <div className="brand-subtitle">
            {isApiConfigured ? "Connected" : "Demo mode (set VITE_API_URL)"}
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="left">
          <div className="section-title">Products</div>
          {!isApiConfigured ? (
            <div className="info">
              Showing demo products. Set <code>VITE_API_URL</code> to load products from your
              backend.
            </div>
          ) : null}
          {loadingProducts ? (
            <div className="muted">Loading products…</div>
          ) : (
            <>
              {productError ? <div className="info">{productError}</div> : null}
              <ProductList products={products} onAddToCart={addToCart} />
            </>
          )}
        </section>

        <aside className="right">
          <div className="section-title">Cart</div>
          <Cart
            items={cartItems}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={remove}
            totalPrice={totalPrice}
            toMoney={toMoney}
          />

          <div className="checkout">
            <div className="section-title">Checkout</div>

            {successMessage ? (
              <div className="success">{successMessage}</div>
            ) : null}
            {submitError ? <div className="error">{submitError}</div> : null}

            <form onSubmit={handleCheckout} className="checkout-form">
              <label className="label">
                Customer name
                <input
                  className="input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John"
                  autoComplete="name"
                />
              </label>
              <button className="button" disabled={submitting}>
                {submitting ? "Placing order…" : "Place order"}
              </button>
              <div className="muted small">
                Total: <strong>{toMoney(totalPrice)}</strong>
              </div>
            </form>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <span className="muted small">
          Tip: set <code>VITE_API_URL</code> in <code>.env</code>.
        </span>
      </footer>
    </div>
  );
}
