import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/RackDetails.css';

const RackDetails = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://consultancy-backend-qg8d.onrender.com/api/products')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Expected an array, got:", res.data);
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const rackOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2'];

  const handleRackChange = (id, newRack) => {
    axios.put(`https://consultancy-backend-qg8d.onrender.com/api/products/update/${id}`, { rack: newRack })
      .then(() => {
        setProducts(prev =>
          prev.map(prod =>
            prod._id === id ? { ...prod, rack: newRack } : prod
          )
        );
      })
      .catch(err => console.error("Error updating rack:", err));
  };

  return (
    <div className="rack-details">
      <h2>Rack Details</h2>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Rack</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
  {products.map(prod => (
    <tr key={prod._id}>
      <td data-label="Product ID">{prod.product_id}</td>
      <td data-label="Name">{prod.name}</td>
      <td data-label="Rack">
        <select
          value={prod.rack || ''}
          onChange={e => handleRackChange(prod._id, e.target.value)}
        >
          <option value="">Select Rack</option>
          {rackOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </td>
      <td data-label="Price">{prod.price}</td>
      <td data-label="Quantity">{prod.quantity}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default RackDetails;
