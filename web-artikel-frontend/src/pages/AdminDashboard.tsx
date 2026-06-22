import { useState, useEffect } from "react";
import api from "../services/api";
import {
  ChevronLeft,
  AlertTriangle,
  Trash2,
  Clock,
  BarChart2,
  FileText,
  MessageSquare,
  Filter,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

// ================= TYPE DEFINITIONS SINKRON DENGAN REST API =================
interface LaporanArtikel {
  id: number;
  alasan: string;
  tanggalDilaporkan: string;
  artikel: {
    id: number;
    judul: string;
  };
  pelapor: {
    username: string;
  };
}

interface LaporanKomentar {
  id: number;
  alasan: string;
  tanggalDilaporkan: string;
  komentar: {
    id: number;
    isi: string;
  };
  pelapor: {
    username: string;
  };
}

interface AdminDashboardProps {
  setView: (v: string) => void;
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
        <div 
          className={`rounded d-flex align-items-center justify-content-center ${accent ? "bg-danger bg-opacity-10 text-danger" : "bg-light text-muted"}`} 
          style={{ width: "36px", height: "36px" }}
        >
          {icon}
        </div>
      </div>
      <h3 className={`fw-bold mb-1 ${accent ? "text-danger" : "text-dark"}`} style={{ fontSize: "1.75rem" }}>
        {value}
      </h3>
      <p className="mb-0 fw-semibold text-secondary small">{label}</p>
      {sub && <p className="mb-0 text-muted mt-1" style={{ fontSize: "0.75rem" }}>{sub}</p>}
    </div>
  );
}

export function AdminDashboard({ setView }: AdminDashboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [laporanArtikel, setLaporanArtikel] = useState<LaporanArtikel[]>([]);
  const [laporanKomentar, setLaporanKomentar] = useState<LaporanKomentar[]>([]);
  const [deletedCount, setDeletedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "article" | "comment"; id: number } | null>(null);

  // 1. Ambil Data Dashboard Mengikuti State Filter Waktu dari Java Backend
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

  // 2. Aksi Hapus Artikel Nyata Menembak Rest API Java
  const handleDeleteArticle = (id: number) => {
    api.delete(`/admin/artikel/hapus/${id}`)
      .then(() => {
        setLaporanArtikel((prev) => prev.filter((item) => item.artikel.id !== id));
        setDeletedCount((c) => c + 1);
        setConfirmDelete(null);
      })
      .catch(() => alert("Gagal menghapus artikel"));
  };

  // 3. Aksi Hapus Komentar Nyata - Menembak REST API Java yang Valid
  const handleDeleteComment = (id: number) => {
    // FIX: Arahkan ke endpoint yang benar-benar ada di backend
    // Jika kamu menambahkan Mapping baru di AdminController Java, pastikan URL-nya sinkron:
    api.delete(`/admin/komentar/hapus/${id}`) 
      .then(() => {
        setLaporanKomentar((prev) => prev.filter((item) => item.komentar.id !== id));
        setDeletedCount((c) => c + 1);
        setConfirmDelete(null);
      })
      .catch((err) => {
        console.error("Gagal menghapus komentar:", err);
        alert("Gagal menghapus komentar. Pastikan endpoint Java sudah terpasang.");
      });
  };

  const totalReports = laporanArtikel.length + laporanKomentar.length;

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <main className="container py-4" style={{ maxWidth: "1140px" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <button
            onClick={() => setView("home")}
            className="btn btn-link p-0 text-decoration-none text-muted d-flex align-items-center gap-1 mb-2 small shadow-none"
          >
            <ChevronLeft size={15} /> Kembali ke Beranda
          </button>
          <h1 className="fw-bold text-dark h3 mb-0">Dashboard & Laporan</h1>
          <p className="text-muted small mb-0">Kelola konten yang dilaporkan oleh pengguna</p>
        </div>

        {/* Filter Waktu */}
        <div className="d-flex align-items-center gap-1 p-1 bg-white border rounded shadow-sm" style={{ width: "fit-content" }}>
          <Filter size={13} className="text-muted ms-2 me-1" />
          {(Object.keys(TIME_FILTER_LABELS) as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`btn btn-sm px-3 rounded ${timeFilter === f ? "btn-dark fw-bold" : "btn-light border-0 text-muted"}`}
              style={{ fontSize: "0.8rem" }}
            >
              {TIME_FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Access Notice */}
      <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 border-start border-3 border-danger border-top-0 border-end-0 border-bottom-0" role="alert" style={{ borderRadius: "8px" }}>
        <ShieldAlert size={15} className="text-danger flex-shrink-0" />
        <span className="small text-dark">
          Akses terbatas — halaman ini hanya dapat diakses via <code className="bg-light px-1 py-0.5 rounded small">/admin/dashboard</code> oleh pengguna dengan peran <strong>ADMIN</strong>.
        </span>
      </div>

      {/* Grid Status Cards Bootstrap */}
      <div className="row row-cols-2 row-cols-lg-4 g-3 mb-4">
        <div className="col">
          <StatCard icon={<AlertTriangle size={16} />} label="Total Laporan Aktif" value={totalReports} sub="Menunggu tindakan" accent />
        </div>
        <div className="col">
          <StatCard icon={<FileText size={16} />} label="Artikel Dilaporkan" value={laporanArtikel.length} sub="Perlu ditinjau" />
        </div>
        <div className="col">
          <StatCard icon={<MessageSquare size={16} />} label="Komentar Dilaporkan" value={laporanKomentar.length} sub="Perlu ditinjau" />
        </div>
        <div className="col">
          <StatCard icon={<CheckCircle size={16} />} label="Konten Dihapus" value={deletedCount} sub="Sesi ini" />
        </div>
      </div>

      <div className="row g-4">
        {/* Table: Artikel Dilaporkan */}
        <div className="col-lg-6">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2 fw-bold text-dark">
              <FileText size={16} className="text-primary" />
              <span>Artikel Dilaporkan</span>
            </div>
            <span className="badge bg-light text-dark border px-2 py-1">{laporanArtikel.length} item</span>
          </div>

          <div className="card shadow-sm border overflow-hidden" style={{ borderRadius: "12px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                  <tr>
                    <th>Judul Artikel / Alasan</th>
                    <th>Pelapor</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanArtikel.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted"><CheckCircle size={20} className="mb-1 d-block mx-auto"/> Bebas laporan</td>
                    </tr>
                  ) : (
                    laporanArtikel.map((lap) => (
                      <tr key={lap.id}>
                        <td>
                          <p className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: "200px" }}>{lap.artikel?.judul || "Artikel Terhapus"}</p>
                          <small className="text-danger">Alasan: {lap.alasan}</small>
                        </td>
                        <td className="text-muted">@{lap.pelapor?.username}</td>
                        <td className="text-end">
                          <button 
                            disabled={!lap.artikel}
                            onClick={() => lap.artikel && setConfirmDelete({ type: "article", id: lap.artikel.id })}
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 py-1"
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

        {/* Table: Komentar Dilaporkan */}
        <div className="col-lg-6">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2 fw-bold text-dark">
              <MessageSquare size={16} className="text-primary" />
              <span>Komentar Dilaporkan</span>
            </div>
            <span className="badge bg-light text-dark border px-2 py-1">{laporanKomentar.length} item</span>
          </div>

          <div className="card shadow-sm border overflow-hidden" style={{ borderRadius: "12px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                  <tr>
                    <th>Isi Komentar / Alasan</th>
                    <th>Pelapor</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanKomentar.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted"><CheckCircle size={20} className="mb-1 d-block mx-auto"/> Bebas laporan</td>
                    </tr>
                  ) : (
                    laporanKomentar.map((lap) => (
                      <tr key={lap.id}>
                        <td>
                          <p className="mb-0 text-dark text-truncate fst-italic" style={{ maxWidth: "200px" }}>"{lap.komentar?.isi || "Komentar Terhapus"}"</p>
                          <small className="text-danger">Alasan: {lap.alasan}</small>
                        </td>
                        <td className="text-muted">@{lap.pelapor?.username}</td>
                        <td className="text-end">
                          <button 
                            disabled={!lap.komentar}
                            onClick={() => lap.komentar && setConfirmDelete({ type: "comment", id: lap.komentar.id })}
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 py-1"
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

      {/* Quick Access Menu Section */}
      <div className="row g-3 mt-4">
        <div className="col-md-4">
          <button className="card p-3 w-100 text-start bg-white border btn hover-light d-flex flex-row align-items-center gap-3 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="bg-light text-primary rounded p-2"><BarChart2 size={16} /></div>
            <div><p className="mb-0 small fw-bold text-dark">Statistik Lengkap</p><small className="text-muted">Lihat laporan terperinci</small></div>
          </button>
        </div>
        <div className="col-md-4">
          <button onClick={() => setView("admin-form-new")} className="card p-3 w-100 text-start bg-white border btn hover-light d-flex flex-row align-items-center gap-3 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="bg-light text-primary rounded p-2"><FileText size={16} /></div>
            <div><p className="mb-0 small fw-bold text-dark">Tulis Artikel Baru</p><small className="text-muted">Tambahkan konten baru</small></div>
          </button>
        </div>
        <div className="col-md-4">
          <button className="card p-3 w-100 text-start bg-white border btn hover-light d-flex flex-row align-items-center gap-3 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="bg-light text-primary rounded p-2"><ShieldAlert size={16} /></div>
            <div><p className="mb-0 small fw-bold text-dark">Aturan Moderasi</p><small className="text-muted">Kelola kebijakan konten</small></div>
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi Penghapusan Konten */}
      {confirmDelete && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content p-3 text-center" style={{ borderRadius: "16px" }}>
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "48px", height: "48px" }}>
                <Trash2 size={20} />
              </div>
              <h5 className="fw-bold text-dark">Konfirmasi</h5>
              <p className="text-muted small mb-4">Konten ini akan dihapus secara permanen dari basis data dan tidak dapat dipulihkan.</p>
              <div className="d-flex gap-2">
                <button onClick={() => setConfirmDelete(null)} className="btn btn-sm btn-light border w-100">Batal</button>
                <button onClick={() => confirmDelete.type === "article" ? handleDeleteArticle(confirmDelete.id) : handleDeleteComment(confirmDelete.id)} className="btn btn-sm btn-danger w-100">Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}