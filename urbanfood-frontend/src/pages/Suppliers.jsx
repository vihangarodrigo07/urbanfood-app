import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Suppliers.css';

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [supplier, setSupplier] = useState({
        supplierId: null,
        name: '',
        contact: '',
        address: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/suppliers');
            setSuppliers(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (supplier.supplierId) {
                await axios.put(`http://localhost:8080/api/suppliers/${supplier.supplierId}`, supplier);
            } else {
                await axios.post('http://localhost:8080/api/suppliers', supplier);
            }
            fetchSuppliers();
            setSupplier({
                supplierId: null,
                name: '',
                contact: '',
                address: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this supplier?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
            fetchSuppliers();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleEdit = (supplier) => {
        setSupplier({
            supplierId: supplier.supplierId,
            name: supplier.name,
            contact: supplier.contact,
            address: supplier.address
        });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="supplier-container">
            <h1>Supplier Management</h1>
            
            <form onSubmit={handleSubmit}>
                <h2>{supplier.supplierId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={supplier.name}
                        onChange={(e) => setSupplier({...supplier, name: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contact:</label>
                    <input
                        type="text"
                        value={supplier.contact}
                        onChange={(e) => setSupplier({...supplier, contact: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Address:</label>
                    <textarea
                        value={supplier.address}
                        onChange={(e) => setSupplier({...supplier, address: e.target.value})}
                        required
                    />
                </div>

                <button type="submit">Save</button>
                {supplier.supplierId && (
                    <button type="button" onClick={() => setSupplier({
                        supplierId: null,
                        name: '',
                        contact: '',
                        address: ''
                    })}>
                        Cancel
                    </button>
                )}
            </form>

            <div className="supplier-list">
                <h2>Supplier Records</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(s => (
                            <tr key={s.supplierId}>
                                <td>{s.supplierId}</td>
                                <td>{s.name}</td>
                                <td>{s.contact}</td>
                                <td>{s.address}</td>
                                <td>
                                    <button onClick={() => handleEdit(s)}>Edit</button>
                                    <button onClick={() => handleDelete(s.supplierId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Supplier;