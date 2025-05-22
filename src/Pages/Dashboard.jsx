import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get("https://consultancy-backend-qg8d.onrender.com/api/products"); // Adjust the URL if needed
        setModules(res.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);

  const totalProducts = modules.length;
  const outOfStock = modules.filter((m) => m.quantity === 0);
  const lowStock = modules.filter((m) => m.quantity > 0 && m.quantity < 20);

  return (
    <div className="dashboard-container p-3 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="d-flex gap-3 flex-wrap mb-4">
        <div className="card card-left p-3 flex-fill">
          <h5>Total Products</h5>
          <p className="display-6">{totalProducts}</p>
        </div>

        <div className="card card-right p-3 flex-fill">
          <h5>Out of Stock</h5>
          <ul style={{ maxHeight: "150px", overflowY: "auto" }}>
            {outOfStock.length > 0 ? (
              outOfStock.map((m, i) => <li key={i}>{m.name}</li>)
            ) : (
              <li>No out-of-stock items</li>
            )}
          </ul>
        </div>
      </div>

      <div className="card card-warning p-3">
        <h5>Low Stock (less than 20)</h5>
        <ul style={{ maxHeight: "150px", overflowY: "auto" }}>
          {lowStock.length > 0 ? (
            lowStock.map((m, i) => (
              <li key={i}>
                {m.name} – Qty: <strong>{m.quantity}</strong>
              </li>
            ))
          ) : (
            <li>All stocks are above 20</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
