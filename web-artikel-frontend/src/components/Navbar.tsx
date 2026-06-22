import { useState } from "react";
import api from "../services/api";
import {
  BookOpen,
  Sparkles,
  Flame,
  User,
  ChevronDown,
  LayoutDashboard,
  PenSquare,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  role: "guest" | "user" | "admin";
  setRole: (r: "guest" | "user" | "admin") => void;
  setView: (v: string) => void;
  currentUsername: string;
  setCurrentUsername: (u: string) => void;
  filterView: "all" | "newest" | "trending";
  setFilterView: (f: "all" | "newest" | "trending") => void;
}

export function Navbar({
  role,
  setRole,
  setView,
  currentUsername,
  setCurrentUsername,
  filterView,
  setFilterView,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNavFilter = (f: "all" | "newest" | "trending") => {
    setFilterView(f);
    setView("home");
  };

  // Fungsi Logout Nyata Menembak REST API Java
  const handleLogout = () => {
    api.post("/auth/keluar")
      .then(() => {
        setRole("guest");
        setCurrentUsername("");
        setProfileOpen(false);
        setView("home");
      })
      .catch((err) => {
        console.error("Gagal logout ke API, jalankan logout lokal:", err);
        // Fallback jika API backend belum siap / session kosong
        setRole("guest");
        setCurrentUsername("");
        setProfileOpen(false);
        setView("home");
      });
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom sticky-top px-3 shadow-sm" style={{ height: "64px" }}>
      <div className="container-fluid max-w-6xl mx-auto d-flex align-items-center justify-content-between">
        
        {/* LOGO */}
        <button
          onClick={() => { setView("home"); setFilterView("all"); }}
          className="btn border-0 p-0 d-flex align-items-center gap-2 text-dark bg-transparent shadow-none"
        >
          <div className="bg-dark rounded d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="fw-bold tracking-tight h5 mb-0">Web Artikel</span>
        </button>

        {/* DESKTOP NAVIGATION FILTER */}
        <div className="collapse navbar-collapse justify-content-center d-none d-md-flex">
          <div className="navbar-nav gap-2">
            <button
              onClick={() => handleNavFilter("newest")}
              className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5 transition-all ${
                filterView === "newest" ? "btn-primary fw-bold" : "btn-light text-muted"
              }`} 
            >
              <Sparkles size={14} /> Artikel Terbaru
            </button>
            <button
              onClick={() => handleNavFilter("trending")}
              className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5 transition-all ${
                filterView === "trending" ? "btn-primary fw-bold" : "btn-light text-muted"
              }`}
            >
              <Flame size={14} /> Artikel Ramai
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH MANAGEMENT */}
        <div className="d-flex align-items-center gap-2">
          {role === "guest" ? (
            <>
              {/* FIX: Alihkan kembali ke view login asli, bukan bypass figma */}
              <button
                onClick={() => setView("login")}
                className="btn btn-sm btn-outline-secondary px-3"
              >
                Masuk
              </button>
              <button
                onClick={() => setView("register")}
                className="btn btn-sm btn-dark px-3"
              >
                Daftar
              </button>
            </>
          ) : (
            <div className="position-relative">
              <div className="d-flex align-items-center gap-2">
                
                {/* Admin Quick Actions */}
                {role === "admin" && (
                  <div className="d-none d-sm-flex align-items-center gap-1 me-2">
                    <button
                      onClick={() => setView("admin-dashboard")}
                      className="btn btn-sm btn-light text-primary fw-semibold d-flex align-items-center gap-1"
                    >
                      <LayoutDashboard size={13} /> Dashboard
                    </button>
                    <button
                      onClick={() => setView("admin-form-new")}
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                    >
                      <PenSquare size={13} /> Tulis
                    </button>
                  </div>
                )}

                {/* Profile Toggle Dropdown */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="btn btn-sm btn-light border d-flex align-items-center gap-2 px-3 py-1.5 shadow-sm"
                >
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>
                    <User size={12} />
                  </div>
                  <span className="fw-semibold text-dark small">{currentUsername}</span>
                  <ChevronDown size={13} className="text-muted" />
                </button>
              </div>

              {/* Menu Dropdown Profil */}
              {profileOpen && (
                <>
                  <div className="position-fixed top-0 start-0 end-0 bottom-0" style={{ zIndex: 10 }} onClick={() => setProfileOpen(false)} />
                  <div className="position-absolute end-0 mt-2 bg-white rounded border shadow-lg py-1" style={{ width: "200px", zIndex: 20 }}>
                    <div className="px-3 py-2 border-bottom text-muted small">
                      Peran: <span className="fw-bold text-dark text-capitalize">{role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger d-flex align-items-center gap-2 px-3 py-2 small"
                    >
                      <LogOut size={14} /> Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}