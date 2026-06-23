import { useState, useEffect } from "react";
import api from "../services/api";
import {
  ChevronLeft,
  PenSquare,
  Save,
  Eye,
  AlertCircle,
} from "lucide-react";

interface AdminFormProps {
  isEdit: boolean;
  articleId: number | null;
  setView: (v: string) => void;
}

export function AdminForm({ isEdit, articleId, setView }: AdminFormProps) {
  const [judul, setJudul] = useState("");
  const [namaPenulis, setNamaPenulis] = useState("");
  const [isi, setIsi] = useState("");
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Muat Data Artikel Lama dari Java jika dalam Mode Edit
  useEffect(() => {
    if (isEdit && articleId) {
      setLoading(true);
      api.get(`/admin/artikel/${articleId}`)
        .then((res) => {
          setJudul(res.data.judul || "");
          setNamaPenulis(res.data.namaPenulisKustom || "");
          setIsi(res.data.isi || "");
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal memuat artikel untuk diedit:", err);
          alert("Artikel gagal dimuat");
          setLoading(false);
        });
    }
  }, [isEdit, articleId]);

  const isValid = judul.trim() && namaPenulis.trim() && isi.trim();

  // 2. Fungsi Kirim Data Konten ke Backend Java
  const handleSave = () => {
    if (!isValid) return;

    const payload = {
      id: isEdit ? articleId : null,
      judul: judul,
      isi: isi,
      namaPenulisKustom: namaPenulis,
    };

    api.post("/admin/artikel/simpan", payload)
      .then(() => {
        setSaved(true);
        setTimeout(() => {
          setView("home");
        }, 1500);
      })
      .catch((err) => {
        console.error("Gagal menyimpan artikel:", err);
        alert("Terjadi kesalahan saat menyimpan artikel.");
      });
  };

  // 3. Fungsi Hapus Artikel Secara Langsung
  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini secara permanen?")) {
      api.delete(`/admin/artikel/hapus/${articleId}`)
        .then(() => {
          alert("Artikel berhasil dihapus");
          setView("home");
        })
        .catch((err) => {
          console.error("Gagal menghapus artikel:", err);
          alert("Gagal menghapus artikel.");
        });
    }
  };

  const wordCount = isi.trim() ? isi.trim().split(/\s+/).length : 0;
  const charCount = isi.length;

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <main className="container py-4" style={{ maxWidth: "960px" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          onClick={() => setView("home")}
          className="btn btn-link p-0 text-decoration-none text-muted d-flex align-items-center gap-1 small shadow-none"
        >
          <ChevronLeft size={16} /> Batal & Kembali
        </button>

        <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-light text-primary">
          <PenSquare size={14} />
          <span className="fw-bold" style={{ fontSize: "0.8125rem" }}>
            {isEdit ? "Edit Artikel" : "Artikel Baru"}
          </span>
        </div>
      </div>

      {/* Access Notice */}
      <div className="alert alert-warning d-flex align-items-center gap-2 py-2 px-3 mb-4 border-start border-3 border-warning border-top-0 border-end-0 border-bottom-0" role="alert" style={{ borderRadius: "8px" }}>
        <AlertCircle size={15} className="text-warning flex-shrink-0" />
        <span className="small text-dark">
          Halaman ini hanya dapat diakses oleh pengguna dengan peran <strong>Admin</strong>. Akses URL:{" "}
          <code className="bg-light px-1 py-0.5 rounded small">
            {isEdit ? `/admin/artikel/edit/${articleId}` : "/admin/artikel/tambah"}
          </code>
        </span>
      </div>

      <div className="row g-4">
        {/* Main Form Left Side */}
        <div className="col-lg-8 d-flex flex-column gap-3">
          {/* Title */}
          <div>
            <label className="form-label small fw-semibold text-dark">
              Judul Artikel <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul artikel yang menarik..."
              className="form-control shadow-none py-2 fw-semibold fs-5"
            />
            <div className="form-text text-muted" style={{ fontSize: "0.75rem" }}>{judul.length} karakter</div>
          </div>

          {/* Custom Author */}
          <div>
            <label className="form-label small fw-semibold text-dark">
              Nama Penulis Kustom <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={namaPenulis}
              onChange={(e) => setNamaPenulis(e.target.value)}
              placeholder="Contoh: Tim Editorial, Ari H., atau Dewi Kusuma"
              className="form-control shadow-none py-2"
              style={{ fontSize: "0.9375rem" }}
            />
            <div className="form-text text-muted" style={{ fontSize: "0.75rem" }}>Nama yang akan ditampilkan kepada pembaca</div>
          </div>

          {/* Content Area */}
          <div>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label small fw-semibold text-dark mb-0">
                Isi Artikel <span className="text-danger">*</span>
              </label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 shadow-none"
                style={{ fontSize: "0.75rem" }}
              >
                <Eye size={12} /> {preview ? "Mode Edit" : "Pratinjau"}
              </button>
            </div>

            {preview ? (
              <div className="form-control border bg-white p-3 min-vh-50 text-dark border-1" style={{ fontSize: "1rem", lineHeight: "1.8", whiteSpace: "pre-wrap", minHeight: "350px" }}>
                {isi || <span className="text-muted fst-italic">Belum ada konten...</span>}
              </div>
            ) : (
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                placeholder="Tulis isi artikel di sini. Gunakan paragraf yang jelas..."
                rows={14}
                className="form-control shadow-none p-3 border-1"
                style={{ fontSize: "0.9375rem", lineHeight: "1.7", resize: "none" }}
              />
            )}
            <div className="form-text text-muted" style={{ fontSize: "0.75rem" }}>
              {wordCount} kata · {charCount} karakter
            </div>
          </div>
        </div>

        {/* Sidebar Right Side */}
        <div className="col-lg-4 d-flex flex-column gap-3">
          {/* Publish Card */}
          <div className="card p-4 shadow-sm border" style={{ borderRadius: "12px" }}>
            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1rem" }}>Penerbitan</h5>

            <div className="d-flex flex-column gap-2 mb-4 small">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Status</span>
                <span className="badge bg-secondary bg-opacity-10 text-primary fw-bold px-2 py-0.5">Draft</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Visibilitas</span>
                <span className="fw-semibold text-dark">Publik</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Tanggal</span>
                <span className="text-dark">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>

            {!isValid && (
              <div className="alert alert-secondary p-2 d-flex align-items-center gap-1.5 mb-3 border-0 small text-muted" style={{ fontSize: "0.75rem" }}>
                <AlertCircle size={12} className="text-primary flex-shrink-0" />
                Lengkapi judul, nama penulis, dan isi artikel.
              </div>
            )}

            {saved ? (
              <div className="btn btn-success w-100 fw-bold py-2 disabled" style={{ fontSize: "0.875rem" }}>
                ✓ Artikel Disimpan!
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={!isValid}
                className="btn btn-dark w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-1"
                style={{ fontSize: "0.9375rem" }}
              >
                <Save size={15} /> Simpan & Terbitkan
              </button>
            )}
          </div>

          {/* Tips Card */}
          <div className="card p-4 shadow-sm border bg-white" style={{ borderRadius: "12px" }}>
            <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "0.9375rem" }}>Tips Penulisan</h5>
            <ol className="ps-3 mb-0 text-muted space-y-1" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
              <li>Gunakan judul yang spesifik dan mengandung kata kunci utama.</li>
              <li>Awali dengan kalimat pembuka yang menarik perhatian.</li>
              <li>Gunakan paragraf pendek (3–5 kalimat) untuk keterbacaan.</li>
              <li>Periksa fakta sebelum menerbitkan artikel.</li>
            </ol>
          </div>

          {/* Danger Zone (edit only) */}
          {isEdit && (
            <div className="card p-4 border border-danger bg-danger bg-opacity-10" style={{ borderRadius: "12px" }}>
              <h5 className="fw-bold text-danger mb-1" style={{ fontSize: "0.875rem" }}>Zona Berbahaya</h5>
              <p className="text-danger small mb-3" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                Tindakan ini tidak dapat dibatalkan dan akan menghapus artikel secara permanen dari database MySQL.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-sm btn-outline-danger w-100 fw-semibold"
                style={{ fontSize: "0.8125rem" }}
              >
                Hapus Artikel Ini
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}