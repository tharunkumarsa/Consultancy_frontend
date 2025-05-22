import React, { useEffect, useState } from "react";
import "../Styles/Billing.css";
import { FaTrashAlt } from "react-icons/fa";

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stockMessage, setStockMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    place: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetch("https://consultancy-backend-qg8d.onrender.com/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product) => {
    if (product.quantity === 0) {
      setStockMessage("The stock is not available");
      setTimeout(() => setStockMessage(""), 3000);
      return;
    }

    const existing = addedProducts.find(p => p.product_id === product.product_id);
    if (existing) {
      if (existing.quantity < product.quantity) {
        setAddedProducts(addedProducts.map(p =>
          p.product_id === product.product_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        ));
      } else {
        setStockMessage("Reached available stock quantity");
        setTimeout(() => setStockMessage(""), 3000);
      }
    } else {
      setAddedProducts([...addedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setAddedProducts(prevProducts =>
      prevProducts.map(p =>
        p.product_id === productId
          ? { ...p, quantity: p.quantity - 1 }
          : p
      ).filter(p => p.quantity > 0)
    );
  };

  const handlePopupInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleConfirm = async () => {
    const newErrors = {};
    Object.entries(customerDetails).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      for (const item of addedProducts) {
        await fetch(`https://consultancy-backend-qg8d.onrender.com/api/products/${item.product_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantityToReduce: item.quantity }),
        });
      }

      await fetch("https://consultancy-backend-qg8d.onrender.com/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customerDetails,
          products: addedProducts,
          total: totalAmount
        }),
      });

      alert("✅ Purchase Confirmed!");
      setAddedProducts([]);
      setCustomerDetails({ name: "", place: "", phone: "", address: "" });
      setShowPopup(false);

      const res = await fetch("https://consultancy-backend-qg8d.onrender.com/api/products");
      const updatedProducts = await res.json();
      setProducts(updatedProducts);
    } catch (err) {
      console.error("❌ Error confirming purchase:", err);
    }
  };

  const totalAmount = addedProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="BillingPage full-page-layout">
      {stockMessage && (
        <div className="stock-popup">
          {stockMessage}
        </div>
      )}

      <div className="left-section">
        <h3 className="section-title">Search Products</h3>
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button className="add-btn" onClick={() => handleAddProduct(product)}>
                      Add
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="right-section">
        <h3 className="section-title">Added Products</h3>
        {addedProducts.length > 0 ? (
          <>
            <table className="added-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {addedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>₹{product.price}</td>
                    <td>₹{product.price * product.quantity}</td>
                    <td>
                      <button onClick={() => handleRemoveProduct(product.product_id)}>
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total-section">
              <h4>Total Amount: ₹{totalAmount}</h4>
              <button className="add-btn" onClick={() => setShowPopup(true)}>
                Confirm Purchase
              </button>
            </div>
          </>
        ) : (
          <p className="no-results">No products added</p>
        )}
      </div>

      {showPopup && (
  <div className="popup-modal">
    <div className="popup-content">
      <h3>Enter Customer Details</h3>
      <input
        name="name"
        placeholder="Name"
        value={customerDetails.name}
        onChange={handlePopupInputChange}
        className={errors.name ? "input-error" : ""}
      />

      <input
        name="place"
        placeholder="Place"
        value={customerDetails.place}
        onChange={handlePopupInputChange}
        className={errors.place ? "input-error" : ""}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={customerDetails.phone}
        onChange={handlePopupInputChange}
        className={errors.phone ? "input-error" : ""}
      />

      <textarea
        name="address"
        placeholder="Address"
        value={customerDetails.address}
        onChange={handlePopupInputChange}
        className={errors.address ? "input-error" : ""}
      />

      <div className="popup-actions">
        <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
        <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Billing;
