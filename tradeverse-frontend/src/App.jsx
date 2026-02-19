import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"; // [NEW]

import Login from "./pages/Login";
import ErrorBoundary from "./components/ErrorBoundary";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import Charts from "./pages/Charts";
import Company from "./pages/Company";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import { PriceProvider } from "./context/PriceContext";

import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <PriceProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Toaster richColors position="top-right" closeButton /> {/* [NEW] */}
            <Routes>

              {/* ROOT: decide login or dashboard */}
              <Route
                path="/"
                element={
                  localStorage.getItem("token")
                    ? <Navigate to="/dashboard" replace />
                    : <Navigate to="/login" replace />
                }
              />

              {/* LOGIN (PUBLIC) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* PROTECTED ROUTES WRAPPED IN LAYOUT */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/company" element={<Company />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </PriceProvider>
    </ThemeProvider>
  );
}
