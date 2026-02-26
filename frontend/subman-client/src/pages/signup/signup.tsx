import AuthForm from "../../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  const handleSignup = (_email: string, _pass: string) => {
    navigate("/dashboard");
  };

  return (
    <>
      <AuthForm type="signup" onSubmit={handleSignup} />
    </>
  );
}
