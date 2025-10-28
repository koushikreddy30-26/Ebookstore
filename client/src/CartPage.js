import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, parseInt(quantity));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div>
                <h3>{item.title}</h3>
                <p>by {item.author}</p>
                <p>${item.price}</p>
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  style={{ width: '60px', marginRight: '10px' }}
                />
                <button onClick={() => removeFromCart(item._id)} className="btn">Remove</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '20px' }}>
            <h2>Total: ${getCartTotal().toFixed(2)}</h2>
            <button onClick={clearCart} className="btn" style={{ marginRight: '10px' }}>Clear Cart</button>
            <button onClick={handleCheckout} className="btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
