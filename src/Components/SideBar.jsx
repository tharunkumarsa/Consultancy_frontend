import React from "react";
import "../Styles/SideBar.css";
import { FiHome, FiSettings, FiFileText, FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate(); // Get the navigation function

  return (
    <div className="SideBar">
      <div className="bar-head">
        <h4>ERP SYSTEM</h4>
      </div>
      <div className="bar-items">
        <div className="item" onClick={() => navigate("/dashboard")}>
          <FiHome className="icon" />
          <span>Dashboard</span>
        </div>

        <div className="item" onClick={() => navigate("/billing")}>
          <FiFileText className="icon" />
          <span>Billing</span>
        </div>

        <div className="item" onClick={() => navigate("/configuration")}>
          <FiSettings className="icon" />
          <span>Configuration</span>
        </div>

        <div className="item" onClick={() => navigate("/revenue")}>
          <FiBarChart2 className="icon" />
          <span>Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
