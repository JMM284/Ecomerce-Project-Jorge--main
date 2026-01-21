import { NavLink, Outlet } from "react-router";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="nav-group">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/cart" className="nav-link">🛒 Cart</NavLink>
          </div>
          <div className="nav-group">
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </div>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}