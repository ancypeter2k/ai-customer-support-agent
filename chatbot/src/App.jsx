import React, { useEffect, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user, fetchMe, logout } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    fetchMe();
    if (!user && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      nav('/login');
    }
  }, [user, fetchMe, nav]);

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden flex flex-col">
      <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-semibold">AI Support</div>
        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <span>{user.email}</span>
              <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
