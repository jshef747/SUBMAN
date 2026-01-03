import { useState } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { supabase } from "../../supabaseClient";
import VerificationModal from "./components/VerificationModal/VerificationModal";

export default function SignUpPage() {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleSignup = async (email: string, pass: string) => {
    console.log("Creating user:", email, pass);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: pass,
    });
    if (error) {
      console.error("Error during signup:", error.message);
    } else {
      console.log("Signup successful:", data);
      setShowVerificationModal(true);
    }
  };

  return (
    <>
      <AuthForm type="signup" onSubmit={handleSignup} />
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
}
