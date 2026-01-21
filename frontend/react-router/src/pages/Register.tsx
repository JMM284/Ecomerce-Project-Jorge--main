import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../api/auth";

export default function Register() {
const [form, setForm] = useState({ username: "", email: "", password: "" });
const navigate = useNavigate();

const handleRegister = async (e: React.FormEvent) => {
    //Prevent the page from refreshing when submitting the form
    e.preventDefault();
    try {
        // Send fields
        await registerUser(form.username, form.email,  form.password); 
        
        alert("Account created successfully!");
        navigate("/login"); 
    } catch (err) {
        // Show error message if registration fails
        alert(err instanceof Error ? err.message : "Registration failed");
    }
};

return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
    <h2 style={{ textAlign: "center", color: "#764ba2" }}>Create Account</h2>
    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
        className="nav-link" style={{ color: "black", border: "1px solid #ccc" }}
        type="text" placeholder="Username" required
        onChange={e => setForm({...form, username: e.target.value})} 
        />
        <input 
        className="nav-link" style={{ color: "black", border: "1px solid #ccc" }}
        type="email" placeholder="Email" required
        onChange={e => setForm({...form, email: e.target.value})} 
        />
        <input 
        className="nav-link" style={{ color: "black", border: "1px solid #ccc" }}
        type="password" placeholder="Password" required
        onChange={e => setForm({...form, password: e.target.value})} 
        />
        <button type="submit" style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white", border: "none", padding: "10px", borderRadius: "4px", cursor: "pointer"
        }}>
        Register Now
        </button>
    </form>
    </div>);
}