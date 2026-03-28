import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(user ? "/dashboard" : "/login");
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <span className="navbar-logo">SUBMAN</span>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/dashboard" onClick={handleDashboardClick}>Dashboard</a>
          </li>
        </ul>
        <ul className="user-actions">
          {user ? (
            <>
              <li>
                <span className="user-email">{user.email}</span>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
