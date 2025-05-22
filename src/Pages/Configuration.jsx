import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaFileInvoiceDollar, FaUser } from "react-icons/fa"; // Import icons from React Icons
import "../Styles/Configuration.css";

const Configuration = () => {
  const navigate = useNavigate();

  const staticCards = [
    {
      title: "Products",
      icon: <FaBoxOpen size={32} />, // Use the React Icon for Products
      route: "/add-module"
    },
    {
      title: "Billing",
      icon: <FaFileInvoiceDollar size={32} />, // Use the React Icon for Billing
      route: "/history"
    },
    {
      title: "User Details",
      icon: <FaUser size={32} />, // Use the React Icon for User
      route: "/users"
    },
    {
      title: "Rack Details",
      icon: <FaBoxOpen size={32} />,
      route: "/rack" // Use the React Icon for Rack
    }
  ];

  return (
    <div className="d-flex flex-grow-1 flex-column">
      <div className="header">Configuration</div>

      <div className="d-flex flex-grow-1 flex-wrap p-3">
        {staticCards.map((item, idx) => (
          <div
            key={idx}
            className="module-card d-flex flex-column align-items-center justify-content-center m-2 p-3 text-center"
            onClick={() => navigate(item.route)}
            style={{ cursor: "pointer" }}
          >
            <div className="icon-container">{item.icon}</div> {/* Place the icon here */}
            <h5>{item.title}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Configuration;
