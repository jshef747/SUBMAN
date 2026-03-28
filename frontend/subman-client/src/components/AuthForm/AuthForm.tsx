import type React from "react";
import { useState } from "react";
import "./AuthForm.css";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (email: string, pass: string) => Promise<void>;
  error?: string;
}

export default function AuthForm({ type, onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = type === "signup";
  const isPasswordTooShort =
    isSignup && password.length > 0 && password.length < 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordTooShort) return;
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
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

        {error && <div className="form-error-message">{error}</div>}

        <button type="submit" className="auth-button" disabled={isLoading || isPasswordTooShort}>
          {isLoading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
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
