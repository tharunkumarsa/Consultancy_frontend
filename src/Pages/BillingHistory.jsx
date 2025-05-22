import React, { useEffect, useState } from "react";
import "../Styles/BillingHistory.css";

const BillingHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetch("https://consultancy-backend-qg8d.onrender.com/api/purchases")
      .then((response) => response.json())
      .then((data) => {
        // Sort by most recent
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sorted);
        setFilteredHistory(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching billing history:", err);
        setError("Failed to load billing history.");
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const date = e.target.value;
    setSearchDate(date);

    if (date) {
      const filtered = history.filter((entry) => {
        const entryDate = new Date(entry.date).toISOString().split("T")[0];
        return entryDate === date;
      });
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="billing-history-page">
      <h2>Billing History</h2>

      <div className="search-container">
        <input
          type="date"
          value={searchDate}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredHistory.length === 0 ? (
        <p>No purchase history available for the selected date.</p>
      ) : (
        filteredHistory.map((entry, index) => (
          <div className="history-card" key={index}>
            <div className="history-header">
              <h3>{entry.customer.name}</h3>
              <p className="date-info">{new Date(entry.date).toLocaleString()}</p>
            </div>
            <div className="customer-info">
              <p><strong>Phone:</strong> {entry.customer.phone}</p>
              <p><strong>Place:</strong> {entry.customer.place}</p>
              <p><strong>Address:</strong> {entry.customer.address}</p>
            </div>

            <table className="history-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {entry.products.map((product, i) => (
                  <tr key={i}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>₹{product.price}</td>
                    <td>₹{product.price * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 className="history-total">Grand Total: ₹{entry.total}</h4>
          </div>
        ))
      )}
    </div>
  );
};

export default BillingHistory;
