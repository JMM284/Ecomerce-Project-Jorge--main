  import { useState } from "react";
  import { loginUser } from "../api/auth";
  import { useNavigate } from "react-router";

  export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const data = await loginUser(username, password);
        
        // Save the access token in local storage
        localStorage.setItem("token", data.access_token);

        // Notify the app that storage has changed
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("local-storage-update"));

        // Redirect to home page
        setTimeout(() => {
          navigate("/");
        }, 100);

      } catch (err: any) {
        setError(err.message || "Login failed. Please check your credentials");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", fontFamily: "sans-serif" }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>User Login</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="user" style={{ fontWeight: "bold" }}>Email:</label>
            <input
              id="user"
              type="text"
              placeholder="email@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>
          
          <div>
            <label htmlFor="pass" style={{ fontWeight: "bold" }}>Password:</label>
            <input
              id="pass"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <p style={{ color: "#d9534f", fontSize: "0.9rem", backgroundColor: "#f9ebeb", padding: "8px", borderRadius: "4px", border: "1px solid #d9534f" }}>
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: "12px",
              backgroundColor: loading ? "#a594b8" : "#764ba2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s"
            }}
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    );
  }