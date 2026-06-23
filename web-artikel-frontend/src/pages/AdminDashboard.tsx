import { useState, useEffect } from "react";
import api from "../services/api";
import {
  ChevronLeft,
  AlertTriangle,
  Trash2,
  FileText,
  MessageSquare,
  Filter,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

interface LaporanArtikel {
  id: number;
  alasan: string;
  tanggalDilaporkan: string;
  artikel: {
    id: number;
    judul: string;
  } | null;
  pelapor: {
    username: string;
  } | null;
}

// FIX 1: Sesuaikan interface dengan properti flat hasil query Map dari backend Java
interface LaporanKomentarFlat {
  id: number;
  alasan: string;
  tanggalDilaporkan: string;
  pelaporUsername: string | null;
  komentarId: number | null;
  komentarIsi: string | null;
  balasanId: number | null;
  balasanIsi: string | null;
  artikelId: number | null;
}

interface AdminDashboardProps {
  setView: (v: string) => void;
  setSelectedArticleId: (id: number | null) => void;
}

type TimeFilter = "hari" | "minggu" | "bulan" | "all";

const TIME_FILTER_LABELS: Record<TimeFilter, string> = {
  hari: "Hari ini",
  minggu: "Minggu ini",
  bulan: "Bulan ini",
  all: "Semua",
};

function StatCard({ icon, label, value, sub, accent = false }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="card p-3 shadow-sm border" style={{ borderRadius: "12px" }}>
      <div className="d-flex items-start justify-between mb-2">
        <div className={`rounded d-flex align-items-center justify-content-center ${accent ? "bg-danger bg-opacity-10 text-danger" : "bg-light text-muted"}`} style={{ width: "36px", height: "36px" }}>
          {icon}
        </div>
      </div>
      <h3 className={`fw-bold mb-1 ${accent ? "text-danger" : "text-dark"}`} style={{ fontSize: "1.75rem" }}>{value}</h3>
      <p className="mb-0 fw-semibold text-secondary small">{label}</p>
      {sub && <p className="mb-0 text-muted mt-1" style={{ fontSize: "0.75rem" }}>{sub}</p>}
    </div>
  );
}

export function AdminDashboard({ setView, setSelectedArticleId }: AdminDashboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [laporanArtikel, setLaporanArtikel] = useState<LaporanArtikel[]>([]);
  // Gunakan tipe interface flat yang baru
  const [laporanKomentar, setLaporanKomentar] = useState<LaporanKomentarFlat[]>([]);
  const [deletedCount, setDeletedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "article" | "comment" | "reply"; id: number } | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/dashboard?filterWaktu=${timeFilter}`)
      .then((res) => {
        setLaporanArtikel(res.data.laporanArtikel || []);
        setLaporanKomentar(res.data.laporanKomentar || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat dashboard admin:", err);
        setLoading(false);
      });
  }, [timeFilter]);

  const handleDeleteArticle = (id: number) => {
    api.delete(`/admin/artikel/hapus/${id}`)
      .then(() => {
        setLaporanArtikel((prev) => prev.filter((item) => item.artikel?.id !== id));
        setDeletedCount((c) => c + 1);
        setConfirmDelete(null);
      })
      .catch(() => alert("Gagal menghapus artikel"));
  };

  const handleDeleteComment = (id: number) => {
    api.delete(`/admin/komentar/hapus/${id}`) 
      .then(() => {
        // FIX 2: Filter berdasarkan komentarId pada struktur flat
        setLaporanKomentar((prev) => prev.filter((item) => item.komentarId !== id));
        setDeletedCount((c) => c + 1);
        setConfirmDelete(null);
      })
      .catch(() => alert("Gagal menghapus komentar"));
  };

  const handleDeleteReply = (id: number) => {
    api.delete(`/admin/balasan/hapus/${id}`)
      .then(() => {
        // FIX 3: Filter berdasarkan balasanId pada struktur flat
        setLaporanKomentar((prev) => prev.filter((item) => item.balasanId !== id));
        setDeletedCount((c) => c + 1);
        setConfirmDelete(null);
      })
      .catch(() => alert("Gagal menghapus balasan komentar"));
  };

  const totalReports = laporanArtikel.length + laporanKomentar.length;

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <main className="container py-4" style={{ maxWidth: "1140px" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <button onClick={() => setView("home")} className="btn btn-link p-0 text-decoration-none text-muted d-flex align-items-center gap-1 mb-2 small shadow-none">
            <ChevronLeft size={15} /> Kembali ke Beranda
          </button>
          <h1 className="fw-bold text-dark h3 mb-0">Dashboard & Laporan</h1>
          <p className="text-muted small mb-0">Kelola konten yang dilaporkan oleh pengguna</p>
        </div>

        {/* Filter Waktu */}
        <div className="d-flex align-items-center gap-1 p-1 bg-white border rounded shadow-sm" style={{ width: "fit-content" }}>
          <Filter size={13} className="text-muted ms-2 me-1" />
          {(Object.keys(TIME_FILTER_LABELS) as TimeFilter[]).map((f) => (
            <button key={f} onClick={() => setTimeFilter(f)} className={`btn btn-sm px-3 rounded ${timeFilter === f ? "btn-dark fw-bold" : "btn-light border-0 text-muted"}`} style={{ fontSize: "0.8rem" }}>
              {TIME_FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 border-start border-3 border-danger border-top-0 border-end-0 border-bottom-0" role="alert" style={{ borderRadius: "8px" }}>
        <ShieldAlert size={15} className="text-danger flex-shrink-0" />
        <span className="small text-dark">
          Akses terbatas — hanya peran <strong>ADMIN</strong> yang diizinkan mengelola dashboard.
        </span>
      </div>

      {/* Grid Stat Cards */}
      <div className="row row-cols-2 row-cols-lg-4 g-3 mb-4">
        <div className="col"><StatCard icon={<AlertTriangle size={16} />} label="Total Laporan" value={totalReports} accent /></div>
        <div className="col"><StatCard icon={<FileText size={16} />} label="Artikel Bermasalah" value={laporanArtikel.length} /></div>
        <div className="col"><StatCard icon={<MessageSquare size={16} />} label="Komentar Bermasalah" value={laporanKomentar.length} /></div>
        <div className="col"><StatCard icon={<CheckCircle size={16} />} label="Konten Dihapus" value={deletedCount} /></div>
      </div>

      <div className="row g-4">
        {/* Table: Artikel Dilaporkan */}
        <div className="col-lg-6">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2 fw-bold text-dark">
              <FileText size={16} className="text-primary" />
              <span>Artikel Dilaporkan</span>
            </div>
          </div>
          <div className="card shadow-sm border overflow-hidden" style={{ borderRadius: "12px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light" style={{ fontSize: "0.75rem" }}>
                  <tr>
                    <th>Artikel / Alasan</th>
                    <th>Pelapor</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanArtikel.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-4 text-muted">Bebas laporan artikel</td></tr>
                  ) : (
                    laporanArtikel.map((lap) => (
                      <tr key={lap.id}>
                        <td>
                          <p 
                            onClick={() => {
                              if (lap.artikel) {
                                setSelectedArticleId(lap.artikel.id);
                                setView("detail");
                              }
                            }} 
                            className="mb-0 fw-bold text-primary text-truncate" 
                            style={{ maxWidth: "180px", cursor: "pointer", textDecoration: "underline" }}
                            title="Klik untuk periksa artikel"
                          >
                            {lap.artikel?.judul || "⚠️ Artikel Terhapus"}
                          </p>
                          <small className="text-danger">Alasan: {lap.alasan}</small>
                        </td>
                        <td className="text-muted">@{lap.pelapor?.username || "anonim"}</td>
                        <td className="text-end">
                          <button disabled={!lap.artikel} onClick={() => lap.artikel && setConfirmDelete({ type: "article", id: lap.artikel.id })} className="btn btn-sm btn-outline-danger py-1">
                            <Trash2 size={11} /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table: Komentar Dilaporkan */}
        <div className="col-lg-6">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2 fw-bold text-dark">
              <MessageSquare size={16} className="text-primary" />
              <span>Komentar Dilaporkan</span>
            </div>
          </div>
          <div className="card shadow-sm border overflow-hidden" style={{ borderRadius: "12px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light" style={{ fontSize: "0.75rem" }}>
                  <tr>
                    <th>Komentar / Alasan</th>
                    <th>Pelapor</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
  {laporanKomentar.length === 0 ? (
    <tr><td colSpan={3} className="text-center py-4 text-muted">Bebas laporan komentar</td></tr>
  ) : (
    laporanKomentar.map((lap) => (
      <tr key={lap.id}>
        <td>
          {/* FIX 4: Mengubah teks konten menjadi tautan aktif menuju artikel detail */}
          {lap.komentarIsi ? (
            <p 
              onClick={() => {
                if (lap.artikelId) {
                  setSelectedArticleId(lap.artikelId);
                  setView("detail");
                }
              }}
              className="mb-0 text-primary fw-bold text-truncate fst-italic" 
              style={{ maxWidth: "180px", cursor: "pointer", textDecoration: "underline" }}
              title="Klik untuk periksa artikel asal komentar ini"
            >
              "{lap.komentarIsi}"
            </p>
          ) : lap.balasanIsi ? (
            <div>
              <p 
                onClick={() => {
                  if (lap.artikelId) {
                    setSelectedArticleId(lap.artikelId);
                    setView("detail");
                  }
                }}
                className="mb-0 text-primary fw-bold text-truncate fst-italic" 
                style={{ maxWidth: "180px", cursor: "pointer", textDecoration: "underline" }}
                title="Klik untuk periksa artikel asal balasan ini"
              >
                "{lap.balasanIsi}"
              </p>
              <span className="badge bg-secondary px-2 py-1 mt-1" style={{ fontSize: "0.6rem" }}>Balasan Konten</span>
            </div>
          ) : (
            <p className="mb-0 text-muted small">⚠️ Konten Terhapus</p>
          )}
          <small className="text-danger d-block mt-1">Alasan: {lap.alasan}</small>
        </td>
        <td className="text-muted">@{lap.pelaporUsername || "anonim"}</td>
        <td className="text-end">
          {/* FIX 5: Evaluasi tombol hapus menggunakan ID properti flat */}
          <button 
            disabled={!lap.komentarId && !lap.balasanId} 
            onClick={() => {
              if (lap.komentarId) {
                setConfirmDelete({ type: "comment", id: lap.komentarId });
              } else if (lap.balasanId) {
                setConfirmDelete({ type: "reply", id: lap.balasanId });
              }
            }} 
            className="btn btn-sm btn-outline-danger py-1"
          >
            <Trash2 size={11} /> Hapus
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {confirmDelete && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content p-3 text-center" style={{ borderRadius: "16px" }}>
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "48px", height: "48px" }}>
                <Trash2 size={20} />
              </div>
              <h5 className="fw-bold text-dark">Konfirmasi Hapus</h5>
              <p className="text-muted small mb-4">Konten ini akan dimusnahkan secara permanen dari database MySQL.</p>
              <div className="d-flex gap-2">
                <button onClick={() => setConfirmDelete(null)} className="btn btn-sm btn-light border w-100">Batal</button>
                <button 
                  onClick={() => {
                    if (confirmDelete.type === "article") handleDeleteArticle(confirmDelete.id);
                    else if (confirmDelete.type === "comment") handleDeleteComment(confirmDelete.id);
                    else if (confirmDelete.type === "reply") handleDeleteReply(confirmDelete.id);
                  }} 
                  className="btn btn-sm btn-danger w-100"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}