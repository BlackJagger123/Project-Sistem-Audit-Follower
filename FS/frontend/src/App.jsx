import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CallbackPage from "./pages/CallbackPage";

function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ background: "#e8eeff" }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-8 py-6 flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-gray-100 animate-spin" style={{ borderTopColor: "#5b8dee" }} />
        <p className="text-sm text-gray-500">Memuat...</p>
      </div>
    </div>
  );
}

// Halaman yang butuh login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

// Halaman yang tidak boleh diakses kalau sudah login
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/auth/google/callback" element={<CallbackPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
