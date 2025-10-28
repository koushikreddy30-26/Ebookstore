import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from './api';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.put(`/orders/${orderId}/cancel`);
        // Refresh orders
        const response = await api.get('/orders');
        setOrders(response.data);
        alert('Order cancelled successfully');
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('Failed to cancel order');
      }
    }
  };

  const handleReturnOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to return this order?')) {
      try {
        await api.put(`/orders/${orderId}/return`);
        // Refresh orders
        const response = await api.get('/orders');
        setOrders(response.data);
        alert('Return request submitted successfully');
      } catch (err) {
        console.error('Error returning order:', err);
        alert('Failed to submit return request');
      }
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders for user:', user);
        const response = await api.get('/orders');
        console.log('Orders response:', response.data);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Please login to view your order history</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>📚 Order History</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card" style={{
            border: '1px solid #ccc',
            padding: '15px',
            margin: '15px 0',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>Order #{order._id.slice(-8)}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: order.orderStatus === 'delivered' ? '#28a745' :
                                 order.orderStatus === 'shipped' ? '#ffc107' :
                                 order.orderStatus === 'confirmed' ? '#007bff' :
                                 order.orderStatus === 'cancelled' ? '#dc3545' :
                                 order.orderStatus === 'returned' ? '#6f42c1' : '#6c757d',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>

                {/* Action buttons based on order status */}
                {order.orderStatus === 'confirmed' && (
                  <button
                    onClick={() => navigate(`/return-cancel/${order._id}`)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}

                {order.orderStatus === 'delivered' && (
                  <button
                    onClick={() => navigate(`/return-cancel/${order._id}`)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#6f42c1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Return
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ margin: 0 }}>
                <strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Total:</strong> ${order.totalAmount?.toFixed(2)}
              </p>
            </div>

            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>

            <h4 style={{ margin: '15px 0 10px 0' }}>Items:</h4>
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
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;
