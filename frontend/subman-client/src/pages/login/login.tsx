import AuthForm from "../../components/AuthForm/AuthForm";

import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function LoginPage() {
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (email: string, pass: string) => {
    setLoginError(""); // Reset error on new attempt
    console.log("Logging in user:", email);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      setLoginError(error.message);
      return;
    }

    navigate("/dashboard");
  };

  return <AuthForm type="login" onSubmit={handleLogin} error={loginError} />;
}
