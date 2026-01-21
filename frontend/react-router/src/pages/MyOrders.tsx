import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Order {
  id: number;
  created_at: string;
  total_cents: number;
  status: string;
  items?: any[]; 
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");

  // If no token, send user to login page
  if (!token) {
    navigate("/login");
    return;
  }
  // Get data from the server
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/orders/my-orders", {
    headers: {
    "Authorization": `Bearer ${token}`
  }
});

      if (!response.ok) {
        throw new Error("Error fetching orders");
      }

      const data = await response.json();
      setOrders(data); // Save the orders in the state
    } catch (error) {
      alert("Error loading your orders.");
    }
  };

  fetchOrders();
}, [navigate]);




  return (
    <div className="orders-container" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} style={{ 
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              margin: "15px 0", 
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              backgroundColor: "white"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span><strong>Order ID:</strong> #{order.id}</span>
                <span style={{ color: "#666" }}>
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Date not available"}
                </span>
              </div>

              {/* List of products inside this order */}
              <div style={{ borderTop: "1px borderBottom: 1px solid #eee", padding: "10px 0", margin: "10px 0" }}>
                {order.items?.map((item: any, idx: number) => (
                  <p key={idx} style={{ fontSize: "0.9rem", margin: "4px 0" }}>
                    • {item.title} (x{item.quantity})
                  </p>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0 }}><strong>Total:</strong> <span style={{ fontSize: "1.2rem", color: "#2c3e50" }}>{(order.total_cents / 100).toFixed(2)}€</span></p>
                <span style={{ 
                  background: "#d4edda", 
                  color: "#155724", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>{order.status}</span>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => {
              if(window.confirm("Do you want to clear the local order history?")) {
                localStorage.removeItem("my-orders");
                setOrders([]);
              }
            }}
            style={{ marginTop: "20px", background: "none", border: "none", color: "#d9534f", cursor: "pointer", textDecoration: "underline" }}
          >

          </button>
        </div>
      )}
    </div>
  );
}