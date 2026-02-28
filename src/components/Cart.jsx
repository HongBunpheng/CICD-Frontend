import React from "react";

export default function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  totalPrice,
  toMoney,
}) {
  if (!items.length) {
    return <div className="muted">Cart is empty.</div>;
  }

  return (
    <div className="cart">
      <div className="cart-items">
        {items.map(({ product, quantity }) => (
          <div className="cart-row" key={product.id}>
            <div className="cart-info">
              <div className="cart-name">{product.name}</div>
              <div className="muted small">{toMoney(product.price)} each</div>
            </div>

            <div className="cart-controls">
              <button
                className="icon-button"
                onClick={() => onDecrease(product.id)}
                aria-label={`Decrease ${product.name}`}
              >
                −
              </button>
              <div className="qty">{quantity}</div>
              <button
                className="icon-button"
                onClick={() => onIncrease(product.id)}
                aria-label={`Increase ${product.name}`}
              >
                +
              </button>
            </div>

            <div className="cart-actions">
              <div className="line-total">
                {toMoney(Number(product.price) * quantity)}
              </div>
              <button
                className="link"
                onClick={() => onRemove(product.id)}
                aria-label={`Remove ${product.name}`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total</span>
        <strong>{toMoney(totalPrice)}</strong>
      </div>
    </div>
  );
}

