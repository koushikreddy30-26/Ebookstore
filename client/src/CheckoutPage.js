import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import QRCode from 'qrcode';
import api from './api';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const generateUPIQR = async (orderId, amount) => {
    const upiId = process.env.REACT_APP_MERCHANT_UPI_ID || 'your-upi-id@yourbank'; // Replace with your actual UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=eBook Store&am=${amount.toFixed(2)}&cu=INR&tn=Order%20${orderId}`;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(upiUrl);
      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const handlePayment = async (paymentMethod) => {
    if (!user) {
      alert('Please login to proceed with payment');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const total = getCartTotal();
      const items = cartItems.map(item => ({
        book: item._id,
        title: item.title,
        author: item.author,
        price: item.price,
        quantity: item.quantity
      }));

      if (paymentMethod === 'cod') {
        // Cash on Delivery
        const response = await api.post('/orders/create-cod', {
          amount: total,
          items
        });
        console.log('COD Order created:', response.data);
        setPaymentSuccess(true);
        clearCart();
        setTimeout(() => navigate('/orders'), 2000);
        return;
      }

      if (paymentMethod === 'upi') {
        // UPI Payment - Create order and generate QR
        const response = await api.post('/orders/create-cod', {
          amount: total,
          items,
          paymentMethod: 'upi'
        });
        console.log('UPI Order created:', response.data);
        await generateUPIQR(response.data.order._id, total);
        return;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Your order has been confirmed and is being processed.</p>
        <p>You will receive updates on your order status.</p>
        <p>Redirecting to order history...</p>
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📚</div>
          <p>Thank you for shopping with eBook Store!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{item.title}</h3>
              <p>by {item.author}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price * item.quantity}</p>
            </div>
          ))}
          <h3>Total: ${getCartTotal().toFixed(2)}</h3>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Payment Options</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>


            <div style={{ border: '2px solid #ffc107', borderRadius: '8px', padding: '15px', backgroundColor: '#fffbf0' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>📱 UPI / QR Code Payment</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                Pay directly using UPI ID or scan QR code with any UPI app
              </p>
              <div style={{
                backgroundColor: '#fef7e0',
                border: '1px solid #fdeaa7',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '15px',
                color: '#8b5a00'
              }} hidden={qrCodeUrl || !process.env.REACT_APP_MERCHANT_UPI_ID}>
                💡 <strong>UPI ID:</strong> {process.env.REACT_APP_MERCHANT_UPI_ID || 'your-upi-id@yourbank'}<br/>
                <small>Send payment directly to this UPI ID</small>
              </div>
              <button
                onClick={() => handlePayment('upi')}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ffc107',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {loading ? 'Processing...' : qrCodeUrl ? 'Order Placed. Scan to Pay' : 'Place Order & Generate QR'}
              </button>
              {qrCodeUrl && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>📱 UPI QR Code</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                    Scan with any UPI app (PhonePe, Google Pay, Paytm, etc.)
                  </p>
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    style={{
                      maxWidth: '200px',
                      border: '2px solid #ffc107',
                      borderRadius: '8px',
                      padding: '10px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ border: '2px solid #007bff', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9ff' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>🚚 Cash on Delivery</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                Pay when your order is delivered to your doorstep
              </p>
              <button
                onClick={() => handlePayment('cod')}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {loading ? 'Processing...' : 'Order with COD'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
