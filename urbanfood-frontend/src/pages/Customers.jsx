import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({
    customerId: null,
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/customers');
      setCustomers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Validate required fields
      if (!customer.name.trim()) {
        throw new Error('Name is required');
      }

      const url = customer.customerId 
        ? `http://localhost:8080/api/customers/${customer.customerId}`
        : 'http://localhost:8080/api/customers';
      
      const method = customer.customerId ? 'put' : 'post';
      
      const response = await axios[method](url, customer);
      
      if (response.data.message) {
        await fetchCustomers();
        setCustomer({
          customerId: null,
          name: '',
          email: '',
          phone: '',
          address: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/customers/${id}`);
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customerToEdit) => {
    setCustomer({
      customerId: customerToEdit.customerId,
      name: customerToEdit.name || '',
      email: customerToEdit.email || '',
      phone: customerToEdit.phone || '',
      address: customerToEdit.address || ''
    });
  };

  return (
    <div className="customers-container">
      <h1>Customer Management</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="customer-form">
        <h2>{customer.customerId ? `Edit Customer #${customer.customerId}` : 'Add New Customer'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({...customer, email: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) => setCustomer({...customer, phone: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea
              value={customer.address}
              onChange={(e) => setCustomer({...customer, address: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : customer.customerId ? 'Update Customer' : 'Add Customer'}
            </button>
            {customer.customerId && (
              <button 
                type="button" 
                onClick={() => setCustomer({
                  customerId: null,
                  name: '',
                  email: '',
                  phone: '',
                  address: ''
                })}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="customers-table-container">
        <h2>Customer List</h2>
        {loading && customers.length === 0 ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.customerId}>
                  <td>{c.customerId}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(c)}
                      disabled={loading}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(c.customerId)}
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

export default Customers;