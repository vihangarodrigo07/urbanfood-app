import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';

export default function Products() {
  const API_URL = 'http://localhost:8080/api/products';

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    supplierId: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Create or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.productId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setFormData({
      productId: product.productId,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      supplierId: product.supplierId
    });
    setIsEditing(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      productId: '',
      name: '',
      category: '',
      price: '',
      stock: '',
      supplierId: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="product-manager-container">
      <h1>Product Management</h1>
      
      {/* Product Form */}
      <div className="product-form">
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Supplier ID:</label>
            <input
              type="number"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {isEditing ? 'Update' : 'Create'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Product Table */}
      <div className="product-table">
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Supplier ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.supplierId}</td>
                <td>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};