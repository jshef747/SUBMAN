import "./navbar.css";

export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <h1>SUBMAN</h1>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
        </ul>
        <ul className="user-actions">
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/signup">Sign Up</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
