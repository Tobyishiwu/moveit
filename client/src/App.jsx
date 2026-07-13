import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import BookDelivery from "./pages/BookDelivery.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import RiderDashboard from "./pages/RiderDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const LandingOrRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Landing />;
  if (user.role === "rider") return <Navigate to="/rider" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingOrRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><Home /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/book"
            element={
              <ProtectedRoute>
                <Layout><BookDelivery /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <Layout><OrderDetails /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rider"
            element={
              <ProtectedRoute>
                <Layout><RiderDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

