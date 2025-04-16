import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payments.css';

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        orderId: '',
        method: '',
        date: ''
    });
    const [newPayment, setNewPayment] = useState({
        orderId: '',
        paymentMethod: 'Credit',
        amount: ''
    });

    useEffect(() => {
        fetchPayments();
        fetchOrders();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filters.orderId) params.orderId = filters.orderId;
            if (filters.method) params.method = filters.method;
            if (filters.date) params.date = filters.date;
            
            const res = await axios.get('http://localhost:8080/api/payments', { params });
            setPayments(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.error('Failed to fetch payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setNewPayment(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            const paymentData = {
                orderId: parseInt(newPayment.orderId),
                paymentMethod: newPayment.paymentMethod,
                amount: parseFloat(newPayment.amount),
                status: "Completed"
            };
            
            await axios.post('http://localhost:8080/api/payments', paymentData);
            alert('Payment processed successfully');
            fetchPayments();
            setNewPayment({ orderId: '', paymentMethod: 'Credit', amount: '' });
        } catch (err) {
            alert(`Payment failed: ${err.response?.data?.message || err.message}`);
            console.error('Payment error:', err);
        }
    };

    const applyFilters = () => {
        fetchPayments();
    };

    if (loading) return <div className="loading">Loading payments...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="payments-container">
            <h1>Payment Management</h1>
            
            <div className="payment-filters">
                <h2>Filter Payments</h2>
                <div className="filter-controls">
                    <div>
                        <label>Order ID:</label>
                        <input 
                            type="number" 
                            name="orderId" 
                            value={filters.orderId}
                            onChange={handleFilterChange}
                            placeholder="Order ID"
                        />
                    </div>
                    <div>
                        <label>Method:</label>
                        <select 
                            name="method" 
                            value={filters.method}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Methods</option>
                            <option value="Credit">Credit Card</option>
                            <option value="Debit">Debit Card</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>
                    <div>
                        <label>Date:</label>
                        <input 
                            type="date" 
                            name="date" 
                            value={filters.date}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <button onClick={applyFilters}>Apply Filters</button>
                </div>
            </div>

            <div className="new-payment">
                <h2>Process New Payment</h2>
                <form onSubmit={handlePaymentSubmit}>
                    <div>
                        <label>Order ID:</label>
                        <select
                            name="orderId"
                            value={newPayment.orderId}
                            onChange={handlePaymentChange}
                            required
                        >
                            <option value="">Select Order</option>
                            {orders.map(order => (
                                <option key={order.orderId} value={order.orderId}>
                                    Order #{order.orderId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Payment Method:</label>
                        <select
                            name="paymentMethod"
                            value={newPayment.paymentMethod}
                            onChange={handlePaymentChange}
                            required
                        >
                            <option value="Credit">Credit Card</option>
                            <option value="Debit">Debit Card</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input
                            type="number"
                            name="amount"
                            value={newPayment.amount}
                            onChange={handlePaymentChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <button type="submit">Process Payment</button>
                </form>
            </div>

            <div className="payments-table">
                <h2>Payment History</h2>
                {payments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order ID</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.paymentId}>
                                    <td>{payment.paymentId}</td>
                                    <td>{payment.orderId}</td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>${payment.amount.toFixed(2)}</td>
                                    <td className={`status-${payment.status.toLowerCase()}`}>
                                        {payment.status}
                                    </td>
                                    <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No payments found</p>
                )}
            </div>
        </div>
    );
}