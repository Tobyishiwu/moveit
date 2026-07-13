import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "rider") navigate("/rider");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-gray-800">
      
      {/* Dynamic Header / Navbar */}
      <nav className="w-full px-6 py-5 flex justify-between items-center max-w-6xl mx-auto border-b border-gray-100 md:border-transparent">
        <Link to="/" className="font-display font-black text-2xl tracking-tight text-gray-900">
          Move<span className="text-accent">It</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <a href="/#services" className="hover:text-black transition-colors">Services</a>
          <a href="/#how-it-works" className="hover:text-black transition-colors">How It Works</a>
        </div>
        <Link
          to="/register"
          className="border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 transition duration-200"
        >
          Sign Up
        </Link>
      </nav>

      {/* Primary Authentication Container */}
      <main className="flex-grow flex items-center justify-center bg-sand/30 py-12 px-4 relative overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/60 p-8 md:p-10 z-10"
        >
          <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight mb-1">Welcome back</h1>
          <p className="text-gray-400 mb-8 text-sm font-medium">Log in to your MoveIt account</p>

          {error && (
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-6"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 pl-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 text-gray-800"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 pl-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <a href="#forgot" className="text-xs font-bold text-accent hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-accent text-white font-bold rounded-xl py-3.5 text-sm shadow-lg shadow-accent/10 hover:brightness-110 transition disabled:opacity-50 select-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-sm font-medium text-gray-400 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Global Utility Footer */}
      <footer className="w-full border-t border-gray-100 py-6 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
          <p>© 2026 MoveIt Logistics Ltd. All rights reserved. Registered across major operating states.</p>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;