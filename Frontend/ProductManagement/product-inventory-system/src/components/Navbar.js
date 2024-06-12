import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    // <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <nav className="navbar navbar-expand-lg fixed-top" id="nav">
      <div className="container-fluid">
      
  
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="company-logo-transparent-png-19.png" alt="" className="me-2" />
           <img src="https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png" alt=""  className="brand-icon me-2"/> 
          
          Product Inventory System
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/product-form">Product Form</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product-list">Product List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/stock-management">Stock Management</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
