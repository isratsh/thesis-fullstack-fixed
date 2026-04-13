import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Dashboard    from "./pages/Dashboard";
import SubmitProject from "./pages/SubmitProject";
import MyProject    from "./pages/MyProject";
import Review       from "./pages/Review";
import AdminPage    from "./pages/AdminPage";
import Notifications from "./pages/Notifications";
import Profile      from "./pages/Profile";
import MeetingScheduler from "./pages/MeetingScheduler";
import Analytics    from "./pages/Analytics";
import Resources    from "./pages/Resources";

import Sidebar        from "./components/Sidebar";
import ToastContainer from "./components/ToastContainer";

export const ThemeContext = createContext();
export const ToastContext = createContext();
export const useTheme = () => useContext(ThemeContext);
export const useToast = () => useContext(ToastContext);

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"var(--bg)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48,marginBottom:16 }}>🎓</div>
        <div style={{ fontSize:16,color:"var(--text2)" }}>Loading...</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppLayout({ children }) {
  const location = useLocation();
  const publicPaths = ["/", "/login", "/register"];
  const isPublic = publicPaths.includes(location.pathname);
  const { dark, toggleDark } = useTheme();
  const { user, logout } = useAuth();
  if (isPublic) return <>{children}</>;
  return (
    <div style={{ display:"flex",flexDirection:"column",minHeight:"100vh" }}>
      <div style={{ display:"flex",flex:1 }}>
        <Sidebar role={user?.role} dark={dark} toggleDark={toggleDark} />
        <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
          <div className="main page-enter">{children}</div>
          <footer className="footer">© 2026 Smart Thesis System | Developed by Israt &amp; Marjana</footer>
        </div>
      </div>
      <button className="logout-btn" onClick={logout}>🚪 Logout</button>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [toasts, setToasts] = useState([]);

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  };

  useEffect(() => {
    // Default to dark theme if not set
    const theme = localStorage.getItem("theme") || "dark";
    setDark(theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      <ToastContext.Provider value={{ addToast }}>
        <AuthProvider>
          <Router>
            <ToastContainer toasts={toasts} />
            <AppLayout>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                <Route path="/my-project" element={<ProtectedRoute roles={["student"]}><MyProject /></ProtectedRoute>} />
                <Route path="/submit" element={<ProtectedRoute roles={["student"]}><SubmitProject /></ProtectedRoute>} />
                <Route path="/meetings" element={<ProtectedRoute roles={["student","supervisor"]}><MeetingScheduler /></ProtectedRoute>} />
                <Route path="/review" element={<ProtectedRoute roles={["supervisor","admin"]}><Review /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </Router>
        </AuthProvider>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}
