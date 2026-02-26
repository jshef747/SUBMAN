import { useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <h1>SUBMAN</h1>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/dashboard" onClick={handleDashboardClick}>Dashboard</a>
          </li>
        </ul>
        <ul className="user-actions">
          <li>
            <span className="user-email">demo</span>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
