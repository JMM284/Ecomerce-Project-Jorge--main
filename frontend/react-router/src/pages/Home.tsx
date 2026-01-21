import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Product } from "../models/products";
import "./Home.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    // Get products from backend
    fetch("http://localhost:8000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Error connecting to server:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  // Filter logic
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home">
      {/* Top bar for login/logout */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#555' }}>👤 Active Session</span>
            <Link to="/my-orders" style={{ textDecoration: 'none', color: '#764ba2', fontWeight: 'bold' }}>My Orders</Link>
            <button 
              onClick={handleLogout}
              style={{ padding: '5px 12px', borderRadius: '5px', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer', background: 'none' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none', color: '#764ba2', fontWeight: 'bold' }}>Login</Link>
        )}
      </div>

      <h1>Product Catalog</h1>
      
      {/* Search bar input section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <p className="subtitle">
        Welcome to our shop. Choose a product to see more details.
      </p>
      
      {/* shows a message while loading or if no products match */}      
      {filteredProducts.length === 0 ? (
        <p className="no-products">Loading products or no matches found...</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="product-card">
              <h2>{product.title}</h2>
              <p className="product-description">{product.description}</p>
              
              <div className="card-footer">
                <span className="price-tag">
                  {(product.price_cents / 100).toFixed(2)} €
                </span>
                <span className="view-details">See details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}