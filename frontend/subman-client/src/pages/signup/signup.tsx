import AuthForm from "../../components/AuthForm/AuthForm";
import { supabase } from "../../supabaseClient";

export default function SignUpPage() {
  const handleSignup = async(email: string, pass: string) => {
    console.log("Creating user:", email, pass);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: pass,
    });
    if (error) {
      console.error("Error during signup:", error.message);
    } else {
      console.log("Signup successful:", data);
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}
