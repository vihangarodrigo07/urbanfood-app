import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({
    orderId: null,
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    items: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create axios instance with base URL and headers
  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use Promise.all to fetch both orders and products
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products')
      ]);
      
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleProductChange = (productId, quantity) => {
    const updatedItems = [...order.items];
    const existingIndex = updatedItems.findIndex(i => i.productId === productId);
    const product = products.find(p => p.productId === productId);

    if (existingIndex >= 0) {
      if (quantity > 0) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity,
          unitPrice: product.price
        };
      } else {
        updatedItems.splice(existingIndex, 1);
      }
    } else if (quantity > 0 && product) {
      updatedItems.push({
        productId,
        quantity,
        unitPrice: product.price
      });
    }

    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    setOrder({
      ...order,
      items: updatedItems,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Validate form
      if (!order.customerId || isNaN(order.customerId) || order.customerId <= 0) {
        throw new Error('Please enter a valid Customer ID');
      }
      if (order.items.length === 0) {
        throw new Error('Please add at least one product');
      }

      const url = order.orderId ? `/orders/${order.orderId}` : '/orders';
      const method = order.orderId ? 'put' : 'post';
      
      const response = await api[method](url, order);
      
      if (response.data) {
        await fetchData();
        setOrder({
          orderId: null,
          customerId: '',
          orderDate: new Date().toISOString().split('T')[0],
          totalAmount: 0,
          items: []
        });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      setLoading(true);
      await api.delete(`/orders/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (orderToEdit) => {
    setOrder({
      orderId: orderToEdit.orderId,
      customerId: orderToEdit.customerId,
      orderDate: orderToEdit.orderDate,
      totalAmount: orderToEdit.totalAmount,
      items: orderToEdit.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    });
  };

  return (
    <div className="orders-container">
      <h1>Order Management</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="order-form">
        <h2>{order.orderId ? `Edit Order #${order.orderId}` : 'Add New Order'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer ID:</label>
            <input
              type="number"
              value={order.customerId}
              onChange={(e) => setOrder({...order, customerId: parseInt(e.target.value) || ''})}
              required
              min="1"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Order Date:</label>
            <input
              type="date"
              value={order.orderDate}
              onChange={(e) => setOrder({...order, orderDate: e.target.value})}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Products:</label>
            <select
              onChange={(e) => {
                const productId = parseInt(e.target.value);
                if (productId) handleProductChange(productId, 1);
                e.target.value = '';
              }}
              disabled={loading || products.length === 0}
            >
              <option value="">Select a product</option>
              {products.map(p => (
                <option key={p.productId} value={p.productId}>
                  {p.name} (${p.price?.toFixed(2) || '0.00'})
                </option>
              ))}
            </select>
            
            {order.items.map(item => {
              const product = products.find(p => p.productId === item.productId);
              return (
                <div key={item.productId} className="order-item">
                  <span>{product?.name || `Product #${item.productId}`}</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(item.productId, parseInt(e.target.value) || 0)}
                    min="1"
                    disabled={loading}
                  />
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => handleProductChange(item.productId, 0)}
                    disabled={loading}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="form-group">
            <label>Total Amount:</label>
            <input
              type="text"
              value={`$${order.totalAmount.toFixed(2)}`}
              readOnly
              className="total-amount"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : order.orderId ? 'Update Order' : 'Create Order'}
            </button>
            {order.orderId && (
              <button 
                type="button" 
                onClick={() => setOrder({
                  orderId: null,
                  customerId: '',
                  orderDate: new Date().toISOString().split('T')[0],
                  totalAmount: 0,
                  items: []
                })}
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="orders-table-container">
        <h2>Current Orders</h2>
        {loading && orders.length === 0 ? (
          <div className="loading-placeholder">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
            <button onClick={fetchData} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.orderId}>
                    <td>{o.orderId}</td>
                    <td>{o.customerId}</td>
                    <td>{o.orderDate}</td>
                    <td>${o.totalAmount?.toFixed(2) || '0.00'}</td>
                    <td>
                      {o.items?.length > 0 ? (
                        <ul className="order-items">
                          {o.items.map(item => {
                            const product = products.find(p => p.productId === item.productId);
                            return (
                              <li key={item.productId}>
                                {product?.name || `Product #${item.productId}`} × {item.quantity} @ ${item.unitPrice?.toFixed(2) || '0.00'}
                              </li>
                            );
                          })}
                        </ul>
                      ) : 'No items'}
                    </td>
                    <td className="actions">
                      <button 
                        onClick={() => handleEdit(o)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;