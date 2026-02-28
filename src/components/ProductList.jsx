import React from "react";

function toMoney(value) {
  const num = Number(value || 0);
  return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function ProductList({ products, onAddToCart }) {
  if (!products?.length) {
    return <div className="muted">No products found.</div>;
  }

  return (
    <div className="grid">
      {products.map((p) => (
        <div className="card" key={p.id}>
          <div className="card-top">
            <div className="card-title">{p.name}</div>
            <div className="card-price">{toMoney(p.price)}</div>
          </div>
          <div className="card-body">
            {p.imageUrl ? (
              <img className="card-img" src={p.imageUrl} alt={p.name} />
            ) : (
              <div className="card-img placeholder">No image</div>
            )}
            <div className="card-desc">{p.description || "—"}</div>
          </div>
          <div className="card-actions">
            <button className="button" onClick={() => onAddToCart(p)}>
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

