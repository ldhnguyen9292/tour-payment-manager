import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MemberDetails from "./components/MemberDetails";
import Navigation from "./components/Navigation";

export default function App() {
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/member/:id" element={isAuthenticated ? <MemberDetails /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
