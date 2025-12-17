import AuthForm from "../../components/AuthForm/AuthForm";

export default function LoginPage() {
  const handleLogin = (email: string, pass: string) => {
    console.log("Logging in user:", email, pass);
    // Backend API call here
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
