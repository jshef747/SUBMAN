import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomePage from "./pages/homepage/homepage";
import DashboardPage from "./pages/dashboard/dashboard";
import SignupPage from "./pages/signup/signup";
import LoginPage from "./pages/login/login";
import Header from "./components/header/header";

function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <HomePage />} />
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
