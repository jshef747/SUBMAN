import type React from "react";
import { useState } from "react";
import "./AuthForm.css"; // We'll rename signup.css to auth.css

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (email: string, pass: string) => void;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSignup = type === "signup";
  const isPasswordTooShort =
    isSignup && password.length > 0 && password.length < 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordTooShort) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    onSubmit(email, password);
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">
        {isSignup ? "Sign Up To Subman" : "Log In To Subman"}
      </h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-line">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
        </div>
        <div className="input-line">
          <label>Password</label>
          <input
            className={isPasswordTooShort ? "input-error" : ""}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {isPasswordTooShort && (
            <span className="error-text">
              Password must be at least 8 characters long.
            </span>
          )}
        </div>

        <button type="submit" className="auth-button">
          {isSignup ? "Sign Up" : "Log In"}
        </button>
        <button
          type="button"
          className="google-btn"
          onClick={() => console.log("Google Auth Clicked")}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google logo"
          />
          {isSignup ? "Sign up with Google" : "Sign in with Google"}
        </button>
        <p className="auth-footer">
          {type === "signup" ? (
            <>
              Already have an account? <a href="/login">Log In</a>
            </>
          ) : (
            <>
              Don't have an account? <a href="/signup">Sign Up</a>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
