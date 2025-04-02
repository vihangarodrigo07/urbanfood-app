import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({
    orderId: null,
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/orders');
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const url = order.orderId 
        ? `http://localhost:8080/api/orders/${order.orderId}`
        : 'http://localhost:8080/api/orders';
      
      const method = order.orderId ? 'put' : 'post';
      
      const response = await axios[method](url, order);
      
      if (response.data.message) {
        await fetchOrders();
        setOrder({
          orderId: null,
          customerId: '',
          orderDate: new Date().toISOString().split('T')[0],
          totalAmount: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
      console.error('Error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-container">
      <h1>Order Management</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="order-form">
        <h2>{order.orderId ? 'Edit Order' : 'Add New Order'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer ID:</label>
            <input
              type="number"
              value={order.customerId}
              onChange={(e) => setOrder({...order, customerId: e.target.value})}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Order Date:</label>
            <input
              type="date"
              value={order.orderDate}
              onChange={(e) => setOrder({...order, orderDate: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Amount:</label>
            <input
              type="number"
              value={order.totalAmount}
              onChange={(e) => setOrder({...order, totalAmount: e.target.value})}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </button>
            {order.orderId && (
              <button 
                type="button" 
                onClick={() => setOrder({
                  orderId: null,
                  customerId: '',
                  orderDate: new Date().toISOString().split('T')[0],
                  totalAmount: ''
                })}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="orders-table-container">
        <h2>Current Orders</h2>
        {loading && orders.length === 0 ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.customerId}</td>
                  <td>{o.orderDate}</td>
                  <td>${parseFloat(o.totalAmount).toFixed(2)}</td>
                  <td className="actions">
                    <button 
                      onClick={() => setOrder(o)}
                      disabled={loading}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(o.orderId)}
                      disabled={loading}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;