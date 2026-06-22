import { useState } from "react";
import api from "../services/api";

interface RegisterProps {
  setView: (v: string) => void;
}

export function Register({ setView }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(false);

    if (!username || !password) {
      setError("Username dan password tidak boleh kosong!");
      return;
    }

    setLoading(true);
    // Menembak REST API Java Spring Boot untuk registrasi
    api.post("/auth/daftar", { username, password })
      .then(() => {
        alert("Pendaftaran berhasil! Silakan masuk.");
        setView("login"); // Oper ke halaman login setelah sukses
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal mendaftar. Username mungkin sudah digunakan.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="card p-4 shadow-sm border" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="fw-bold text-center mb-4">Daftar Akun</h3>
        
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan username baru"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Buat password aman"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-dark w-100 fw-semibold mb-3" disabled={loading}>
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>
        
        <p className="text-center small text-muted mb-0">
          Sudah punya akun?{" "}
          <button onClick={() => setView("login")} className="btn btn-link p-0 small text-decoration-none fw-semibold">
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
}