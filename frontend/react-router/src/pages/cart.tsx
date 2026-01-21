import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import "./cart.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Function to add one unit
  const addOne = (id: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Function to subtract one unit
  const subOne = (id: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate total price with a loop
  let totalPriceCents = 0;
  cartItems.forEach(item => {
    totalPriceCents += item.price_cents * item.quantity;
  });

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    // Check if user is logged
    if (!token) {
      alert("You must be logged in to complete the purchase.");
      navigate("/login");
      return;
    }

    try {
      // Send the order to the backend
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token 
        },
        body: JSON.stringify(
          cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        )
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + (errorData.detail || "Problem processing order"));
        return;
      }
      // Success
      alert("Order completed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/my-orders");

    } catch (error) {
      alert("Server connection error.");
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-back">View products</Link>
        </div>
      ) : (
        <div className="cart-content">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3>{item.title}</h3>
                <div className="quantity-controls">
                  <button
                    onClick={() => subOne(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => addOne(item.id)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="delete-icon"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="item-total-price">
                {(item.price_cents / 100 * item.quantity).toFixed(2)} €
              </p>
            </div>
          ))}
          <div className="cart-total">
            <h2>Total: {(totalPriceCents / 100).toFixed(2)} €</h2>
            <button className="checkout-btn" onClick={handleCheckout}>
              Complete Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  );
}