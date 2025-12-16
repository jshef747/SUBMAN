import AuthForm from "../../components/AuthForm/AuthForm";

export default function SignUpPage() {
  const handleSignup = (email: string, pass: string) => {
    console.log("Creating user:", email, pass);
    // Backend API call here
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}
