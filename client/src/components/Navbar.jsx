import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const linkClass = (path) =>
    `text-sm font-medium px-3 py-1.5 rounded-full transition ${
      location.pathname === path
        ? "bg-(--color-accent) text-white"
        : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <Link to={user.role === "rider" ? "/rider" : user.role === "admin" ? "/admin" : "/dashboard"} className="font-bold text-lg">
          Move<span className="text-(--color-accent)">It</span>
        </Link>

        <div className="flex items-center gap-1">
          {user.role === "customer" && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>Home</Link>
              <Link to="/book" className={linkClass("/book")}>Book</Link>
            </>
          )}
          {user.role === "rider" && (
            <Link to="/rider" className={linkClass("/rider")}>Dashboard</Link>
          )}
          {user.role === "admin" && (
            <Link to="/admin" className={linkClass("/admin")}>Admin</Link>
          )}
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-gray-600 px-3 py-1.5"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
