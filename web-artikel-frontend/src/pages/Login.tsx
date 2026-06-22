import { useState } from "react";
import api from "../services/api";
import { LogIn, ShieldAlert, User, Lock } from "lucide-react";

interface LoginProps {
  setView: (v: string) => void;
  setIsLoggedIn: (status: boolean) => void;
}

export function Login({ setView, setIsLoggedIn }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    // Spring Security default membaca login via x-www-form-urlencoded (Form Data)
    const formData = new URLSearchParams();
    formData.append("username", username.trim());
    formData.append("password", password);

    api.post("/auth/masuk", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(() => {
        // Simpan username asli yang diinput ke localStorage secara instan
        localStorage.setItem("username", username.trim());
        
        setIsLoggedIn(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Login gagal:", err);
        setLoading(false);
        setError("Username atau password salah. Silakan coba lagi.");
      });
  };

  return (
    <main className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow border-0" style={{ width: "100%", maxWidth: "400px", borderRadius: "16px" }}>
        
        {/* Header Kartu - NETRAL */}
        <div className="text-center mb-4">
          <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "48px", height: "48px" }}>
            <LogIn size={22} />
          </div>
          <h4 className="fw-bold text-dark mb-1">Selamat Datang</h4>
          <p className="text-muted small">Silakan masuk ke akun Anda</p>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-3 border-0 small" style={{ borderRadius: "8px" }}>
            <ShieldAlert size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* Input Username */}
          <div>
            <label className="form-label small fw-semibold text-dark">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted"><User size={16} /></span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                className="form-control shadow-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="form-label small fw-semibold text-dark">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted"><Lock size={16} /></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="form-control shadow-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Tombol Submit - NETRAL */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark w-100 fw-bold py-2 mt-2 d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: "8px" }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <>Masuk Akun</>
            )}
          </button>
        </form>

        {/* Registrasi Link */}
        <div className="text-center mt-4 small">
          <span className="text-muted">Belum punya akun? </span>
          <button onClick={() => setView("register")} className="btn btn-link p-0 small fw-bold text-decoration-none text-dark shadow-none">
            Daftar Sekarang
          </button>
        </div>

      </div>
    </main>
  );
}