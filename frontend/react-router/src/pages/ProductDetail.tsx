import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import type { Product } from "../models/products"; 
import "./ProductDetails.css";


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Fetch product data from the backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) return <div className="product-detail-container">Loading product...</div>;
  if (!product) return <div className="product-detail-container">Product not found</div>;

  const handleAddToCart = async () => {
    // Call to update the stock in the database
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}/reduce_stock?quantity=${quantity}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Stock error");
        return;
      }

      const data = await response.json();

      // Synchronize the local state with the new stock from the server
      setProduct({ ...product, stock: data.new_stock });

      // Save the item to localStorage to keep in the cart 
      const savedCart = localStorage.getItem("cart");
      const currentCart = savedCart ? JSON.parse(savedCart) : [];
      const newItem = {
        id: product.id,
        title: product.title,
        price_cents: product.price_cents,
        quantity: quantity
      };

      // Check if the item is already in the cart
      const existingIndex = currentCart.findIndex((item: any) => item.id === product.id);
      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += quantity;
      } else {
        currentCart.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));
      setQuantity(1); 
      
    } catch (err) {
      alert("Could not connect to the server");
    }
  };

  return (
    <div className="product-detail-container">
      <Link to="/" className="back-link">← Back to catalog</Link>
      <div className="product-detail-card">
        <h1>{product.title}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-price">{(product.price_cents / 100).toFixed(2)} €</p>
        
        <div className="stock-status">
          {/* Real-time stock display */}
          <span>Available stock {product.stock}</span>
        </div>

        <div className="purchase-controls">
          <button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))} 
            disabled={quantity <= 1}
          >-</button>
          
          <span>{quantity}</span>
          
          <button 
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
            disabled={quantity >= product.stock}
          >+</button>

          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}