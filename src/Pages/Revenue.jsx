import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336"];

const getMonthName = (date) =>
  new Date(date).toLocaleString("default", { month: "short" });

const RevenueDashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // Fetch purchases on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchasesRes = await axios.get("https://consultancy-backend-qg8d.onrender.com/api/purchases");
        const productsRes = await axios.get("https://consultancy-backend-qg8d.onrender.com/api/products");

        setPurchases(purchasesRes.data);
        setAllProducts(productsRes.data.map((p) => p.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Get distinct months from purchase data
  const allMonths = useMemo(() => {
    const monthsSet = new Set();
    purchases.forEach((purchase) => {
      monthsSet.add(getMonthName(purchase.date));
    });
    return Array.from(monthsSet).sort(
      (a, b) =>
        new Date(`1 ${a} 2023`).getMonth() - new Date(`1 ${b} 2023`).getMonth()
    );
  }, [purchases]);

  // Filter purchases based on selected product and month
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      // Filter by month if selected
      const month = getMonthName(purchase.date);
      if (selectedMonth !== "All" && month !== selectedMonth) return false;

      // Filter by product if selected
      if (selectedProduct === "All") return true;

      // Check if purchase contains the selected product
      return purchase.products.some((p) => p.name === selectedProduct);
    });
  }, [purchases, selectedProduct, selectedMonth]);

  // Calculate monthly revenue & profit for filtered purchases
  const monthlyData = useMemo(() => {
    const data = {};

    filteredPurchases.forEach((purchase) => {
      const month = getMonthName(purchase.date);
      if (!data[month]) data[month] = { month, revenue: 0, profit: 0 };

      // If filtering by product, only sum relevant product(s)
      let filteredProducts = purchase.products;
      if (selectedProduct !== "All") {
        filteredProducts = purchase.products.filter((p) => p.name === selectedProduct);
      }

      filteredProducts.forEach((product) => {
        data[month].revenue += product.price * product.quantity;
        data[month].profit +=
          (product.price - product.purchasePrice) * product.quantity;
      });
    });

    // Return sorted array by month
    return Object.values(data).sort(
      (a, b) =>
        new Date(`1 ${a.month} 2023`).getMonth() -
        new Date(`1 ${b.month} 2023`).getMonth()
    );
  }, [filteredPurchases, selectedProduct]);

  // Calculate total revenue & profit per product for filtered purchases
  const productData = useMemo(() => {
    const dataMap = {};

    filteredPurchases.forEach((purchase) => {
      purchase.products.forEach((product) => {
        // If filtering by month, no further filter needed here since already filtered purchases by month
        if (selectedProduct !== "All" && product.name !== selectedProduct) return;

        if (!dataMap[product.name]) {
          dataMap[product.name] = { name: product.name, revenue: 0, profit: 0 };
        }

        dataMap[product.name].revenue += product.price * product.quantity;
        dataMap[product.name].profit +=
          (product.price - product.purchasePrice) * product.quantity;
      });
    });

    return Object.values(dataMap);
  }, [filteredPurchases, selectedProduct]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Revenue & Profit Dashboard</h1>

      {/* Filters */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Product filter */}
        <label>
          Filter by Product:&nbsp;
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="All">All</option>
            {allProducts.map((productName) => (
              <option key={productName} value={productName}>
                {productName}
              </option>
            ))}
          </select>
        </label>

        {/* Month filter */}
        <label>
          Filter by Month:&nbsp;
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="All">All</option>
            {allMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Monthly Revenue & Profit Line Chart */}
      <div style={{ marginBottom: 50 }}>
        <h2>Monthly Revenue & Profit</h2>
        {monthlyData.length === 0 ? (
          <p>No data available for the selected filters.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS[0]}
                strokeWidth={3}
                name="Revenue"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={COLORS[1]}
                strokeWidth={3}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Product Revenue & Profit Bar Chart */}
      <div style={{ marginBottom: 50 }}>
        <h2>Revenue & Profit by Product</h2>
        {productData.length === 0 ? (
          <p>No data available for the selected filters.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={productData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                interval={0}
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend verticalAlign="top" />
              <Bar
                dataKey="revenue"
                fill={COLORS[0]}
                name="Revenue"
                barSize={20}
                radius={[5, 5, 5, 5]}
              />
              <Bar
                dataKey="profit"
                fill={COLORS[1]}
                name="Profit"
                barSize={20}
                radius={[5, 5, 5, 5]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Stats */}
      <div
        style={{
          borderTop: "1px solid #ddd",
          paddingTop: 20,
          fontSize: 16,
          display: "flex",
          gap: 30,
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>Total Revenue: </strong>₹
          {filteredPurchases
            .reduce((acc, p) => acc + p.total, 0)
            .toLocaleString()}
        </div>
        <div>
          <strong>Total Profit: </strong>₹
          {filteredPurchases
            .reduce((acc, purchase) => {
              return (
                acc +
                purchase.products.reduce(
                  (acc2, product) =>
                    acc2 +
                    (product.price - product.purchasePrice) * product.quantity,
                  0
                )
              );
            }, 0)
            .toLocaleString()}
        </div>
        <div>
          <strong>Products Sold: </strong>
          {filteredPurchases.reduce(
            (acc, p) => acc + p.products.reduce((acc2, pr) => acc2 + pr.quantity, 0),
            0
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
