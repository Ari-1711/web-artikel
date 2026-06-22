import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { ArticleDetail } from "./pages/ArticleDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminForm } from "./pages/AdminForm";
import { Login } from "./pages/Login"; // FIX 1: Import komponen Login baru kamu
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./pages/Register";

export default function App() {
  const [view, setView] = useState<string>("home");
  const [filterView, setFilterView] = useState<"all" | "newest" | "trending">("all");
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  
  // State Autentikasi User (Default: "guest" untuk pengunjung awal)
  const [role, setRole] = useState<"guest" | "user" | "admin">("guest"); 
  const [currentUsername, setCurrentUsername] = useState<string>("");

  // Handler pembantu setelah login sukses dari Java Backend
  const handleLoginSuccess = (username: string, userRole: "user" | "admin") => {
    setCurrentUsername(username);
    setRole(userRole);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar
        role={role}
        setRole={setRole}
        setView={setView}
        currentUsername={currentUsername}
        setCurrentUsername={setCurrentUsername}
        filterView={filterView}
        setFilterView={setFilterView}
      />

      {view === "home" && (
        <HomePage
          filterView={filterView}
          setFilterView={setFilterView}
          setView={setView}
          setSelectedArticleId={setSelectedArticleId}
          role={role === "guest" ? "user" : role} // Map ke tipe internal HomePage jika perlu
          currentUsername={currentUsername}
        />
      )}

      {view === "detail" && (
        <ArticleDetail
          articleId={selectedArticleId}
          setView={setView}
          role={role}
          currentUsername={currentUsername}
        />
      )}

     {/* FIX: Login Tanpa Prompt & Batasi Ketat Hak Akses Admin */}
{view === "login" && (
  <Login 
    setView={setView} 
    setIsLoggedIn={(status) => { 
      if (status) {
        const loggedInUser = localStorage.getItem("username") || "";

        if (loggedInUser.toLowerCase() === "admin") {
          setCurrentUsername("admin");
          setRole("admin");
          setView("admin-dashboard"); // Jika yang login "admin", bawa ke dashboard
        } else {
          setCurrentUsername(loggedInUser);
          setRole("user");
          setView("home"); // Jika yang login user lain, bawa ke beranda utama
        }
      }
    }} 
  />
)}

{/* Tampilkan halaman Register jika view bernilai "register" */}
{view === "register" && <Register setView={setView} />}
      {/* Sebelum: {view === "admin-dashboard" && <AdminDashboard setView={setView} />} */}

{view === "admin-dashboard" && (
  <ProtectedRoute role={role} allowedRoles={["admin"]} fallbackView="login" setView={setView}>
    <AdminDashboard setView={setView} />
  </ProtectedRoute>
)}

{view === "admin-form-new" && (
  <ProtectedRoute role={role} allowedRoles={["admin"]} fallbackView="login" setView={setView}>
    <AdminForm isEdit={false} articleId={null} setView={setView} />
  </ProtectedRoute>
)}

{view === "admin-form-edit" && (
  <ProtectedRoute role={role} allowedRoles={["admin"]} fallbackView="login" setView={setView}>
    <AdminForm isEdit={true} articleId={selectedArticleId} setView={setView} />
  </ProtectedRoute>
)}
    </div>
  );
}