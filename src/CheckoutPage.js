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
    const upiId = process.env.REACT_APP_RAZORPAY_UPI_ID || 'merchant@upi';
    const upiUrl = `upi://pay?pa=${upiId}&pn=Merchant&am=${amount}&cu=INR&tn=Order%20${orderId}`;
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

      // Online Payment (Razorpay)
      const { data: orderData } = await api.post('/payments/create-order', {
        amount: total,
        items
      });

      console.log('Razorpay order created:', orderData);

      // Generate UPI QR code immediately for display
      await generateUPIQR(orderData.id, total);

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_id', // Fallback for safety
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'eBook Store',
        description: 'Purchase eBooks',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            console.log('Payment successful:', response);
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId
            });
            console.log('Payment verified:', verifyResponse.data);
            setPaymentSuccess(true);
            clearCart();
            setTimeout(() => navigate('/orders'), 2000);
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user.username,
          email: user.email
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
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
            <div style={{ border: '2px solid #28a745', borderRadius: '8px', padding: '15px', backgroundColor: '#f8fff8' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>💳 Online Payment (Razorpay)</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                Pay securely with UPI, cards, net banking, or wallets
              </p>
              <button
                onClick={() => handlePayment('razorpay')}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {loading ? 'Processing...' : 'Pay Online Now'}
              </button>
              {qrCodeUrl && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>📱 UPI QR Code</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                    Scan with any UPI app (PhonePe, Google Pay, Paytm, etc.)
                  </p>
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    style={{
                      maxWidth: '200px',
                      border: '2px solid #28a745',
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
