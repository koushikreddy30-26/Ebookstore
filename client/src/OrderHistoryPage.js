import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from './api';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

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

  // Separate orders by status
  const activeOrders = orders.filter(order => !['cancelled', 'returned'].includes(order.orderStatus));
  const cancelledOrders = orders.filter(order => order.orderStatus === 'cancelled');
  const returnedOrders = orders.filter(order => order.orderStatus === 'returned');

  const renderOrderCard = (order) => (
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

      {(order.cancelReason || order.returnReason) && (
        <p style={{ margin: '5px 0', color: '#666', fontStyle: 'italic' }}>
          <strong>Reason:</strong> {order.cancelReason || order.returnReason}
        </p>
      )}

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
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>📚 Order History</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
        </div>
      ) : (
        <>
          {/* Active Orders Section */}
          {activeOrders.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>📦 Active Orders</h2>
              {activeOrders.map(order => renderOrderCard(order))}
            </div>
          )}

          {/* Cancelled Orders Section */}
          {cancelledOrders.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>❌ Cancelled Orders</h2>
              {cancelledOrders.map(order => renderOrderCard(order))}
            </div>
          )}

          {/* Returned Orders Section */}
          {returnedOrders.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#6f42c1', borderBottom: '2px solid #6f42c1', paddingBottom: '10px' }}>↩️ Returned Orders</h2>
              {returnedOrders.map(order => renderOrderCard(order))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
