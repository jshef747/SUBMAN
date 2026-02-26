import AuthForm from "../../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (_email: string, _pass: string) => {
    navigate("/dashboard");
  };

  return <AuthForm type="login" onSubmit={handleLogin} error="" />;
}
