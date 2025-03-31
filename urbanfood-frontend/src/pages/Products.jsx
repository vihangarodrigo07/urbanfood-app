import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        console.log('API Response:', response); // Add this line
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Full Error:', error); // Enhanced error logging
        if (error.response) {
          console.log('Error Data:', error.response.data);
          console.log('Error Status:', error.response.status);
        }
      });
  }, []);

  return (
    <div className="products-container">
      <h1>Product Management</h1>
      {products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Supplier ID</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.supplierId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}