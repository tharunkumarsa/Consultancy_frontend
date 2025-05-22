import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import SideBar from "./Components/SideBar";
import Router from "./Pages/Router";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { ModuleProvider } from "./Context/ModuleContext";
import "./App.css";

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="d-flex">
      {!hideSidebar && (
        <div className="sidebar-fixed">
          <SideBar />
        </div>
      )}
      <div className="main-content">
        <ModuleProvider>
          <Router />
        </ModuleProvider>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
