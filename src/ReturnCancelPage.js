import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from './api';

const ReturnCancelPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState(''); // 'cancel' or 'return'
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get('/orders');
        const foundOrder = response.data.find(o => o._id === orderId);
        if (!foundOrder) {
          setError('Order not found');
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (user && orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [user, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!action) {
      alert('Please select an action');
      return;
    }

    const confirmMessage = action === 'cancel'
      ? 'Are you sure you want to cancel this order?'
      : 'Are you sure you want to return this order?';

    if (!window.confirm(confirmMessage)) return;

    setSubmitting(true);
    try {
      if (action === 'cancel') {
        await api.put(`/orders/${orderId}/cancel`);
        alert('Order cancelled successfully');
      } else {
        await api.put(`/orders/${orderId}/return`);
        alert('Return request submitted successfully');
      }
      navigate('/orders');
    } catch (err) {
      console.error('Error processing request:', err);
      alert(`Failed to ${action} order`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Please login to access this page</div>;
  if (!order) return <div>Order not found</div>;

  const canCancel = order.orderStatus === 'confirmed';
  const canReturn = order.orderStatus === 'delivered';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>📦 Return/Cancel Order</h1>

      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        marginBottom: '20px'
      }}>
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> #{order._id.slice(-8)}</p>
        <p><strong>Status:</strong> {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</p>
        <p><strong>Total:</strong> ${order.totalAmount?.toFixed(2)}</p>
        <p><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

        <h3>Items:</h3>
        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
          {order.items.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none'
            }}>
              <div>
                <strong>{item.title}</strong>
                <br />
                <span style={{ color: '#666', fontSize: '14px' }}>by {item.author}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>${item.price} × {item.quantity}</div>
                <div style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>Select Action</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input
              type="radio"
              name="action"
              value="cancel"
              checked={action === 'cancel'}
              onChange={(e) => setAction(e.target.value)}
              disabled={!canCancel}
            />
            {' '}Cancel Order {canCancel ? '' : '(Not available for this order status)'}
          </label>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input
              type="radio"
              name="action"
              value="return"
              checked={action === 'return'}
              onChange={(e) => setAction(e.target.value)}
              disabled={!canReturn}
            />
            {' '}Return Order {canReturn ? '' : '(Not available for this order status)'}
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="reason" style={{ display: 'block', marginBottom: '5px' }}>
            Reason (Optional):
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for your request..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '80px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={submitting || !action}
            style={{
              padding: '10px 20px',
              backgroundColor: action === 'cancel' ? '#dc3545' : '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting || !action ? 'not-allowed' : 'pointer',
              opacity: submitting || !action ? 0.6 : 1
            }}
          >
            {submitting ? 'Processing...' : action === 'cancel' ? 'Cancel Order' : 'Submit Return Request'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/orders')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Orders
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturnCancelPage;
