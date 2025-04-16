import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Delivery.css';

const Delivery = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [delivery, setDelivery] = useState({
        orderId: '',
        status: 'Pending',
        deliveryDate: new Date().toISOString().split('T')[0]
    });

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    useEffect(() => {
        fetchDeliveries();
        fetchOrders();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/deliveries');
            setDeliveries(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (delivery.deliveryId) {
                await axios.put(`http://localhost:8080/api/deliveries/${delivery.deliveryId}`, delivery);
            } else {
                await axios.post('http://localhost:8080/api/deliveries', delivery);
            }
            fetchDeliveries();
            setDelivery({
                orderId: '',
                status: 'Pending',
                deliveryDate: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this delivery?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/deliveries/${id}`);
            fetchDeliveries();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleEdit = (delivery) => {
        setDelivery({
            deliveryId: delivery.deliveryId,
            orderId: delivery.orderId,
            status: delivery.status,
            deliveryDate: delivery.deliveryDate
        });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="delivery-container">
            <h1>Delivery Management</h1>
            
            <form onSubmit={handleSubmit}>
                <h2>{delivery.deliveryId ? 'Edit Delivery' : 'Add New Delivery'}</h2>
                
                <div className="form-group">
                    <label>Order:</label>
                    <select
                        value={delivery.orderId}
                        onChange={(e) => setDelivery({...delivery, orderId: e.target.value})}
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

                <div className="form-group">
                    <label>Status:</label>
                    <select
                        value={delivery.status}
                        onChange={(e) => setDelivery({...delivery, status: e.target.value})}
                        required
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Delivery Date:</label>
                    <input
                        type="date"
                        value={delivery.deliveryDate}
                        onChange={(e) => setDelivery({...delivery, deliveryDate: e.target.value})}
                        required
                    />
                </div>

                <button type="submit">Save</button>
                {delivery.deliveryId && (
                    <button type="button" onClick={() => setDelivery({
                        orderId: '',
                        status: 'Pending',
                        deliveryDate: new Date().toISOString().split('T')[0]
                    })}>
                        Cancel
                    </button>
                )}
            </form>

            <div className="delivery-list">
                <h2>Delivery Records</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Order ID</th>
                            <th>Status</th>
                            <th>Delivery Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveries.map(d => (
                            <tr key={d.deliveryId}>
                                <td>{d.deliveryId}</td>
                                <td>{d.orderId}</td>
                                <td className={`status-${d.status.toLowerCase()}`}>{d.status}</td>
                                <td>{new Date(d.deliveryDate).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(d)}>Edit</button>
                                    <button onClick={() => handleDelete(d.deliveryId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Delivery;