import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Heart,
  Flag,
  MessageSquare,
  ChevronLeft,
  Send,
  CornerDownRight,
  X,
  Clock,
  Calendar,
  User,
  PenSquare,
} from "lucide-react";

// ================= TYPE DEFINITIONS SINKRON DENGAN JAVA =================
interface Pengguna {
  id: number;
  username: string;
}

interface BalasanKomentar {
  id: number;
  isi: string;
  tanggalDibuat: string;
  penulis: Pengguna;
}

interface Komentar {
  id: number;
  isi: string;
  tanggalDibuat: string;
  penulis: Pengguna;
  daftarBalasan: BalasanKomentar[];
}

interface Artikel {
  id: number;
  judul: string;
  isi: string;
  namaPenulisKustom?: string;
  urlGambar?: string;
  tanggalDibuat: string;
  penulisAkun?: Pengguna;
  likes?: Pengguna[];
}

interface ArticleDetailProps {
  articleId: number | null;
  setView: (v: string) => void;
  role: "guest" | "user" | "admin";
  currentUsername?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ================= MODAL REPORT CONTROLLER =================
function ReportModal({
  title,
  onClose,
  onSubmit,
}: {
  title: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-2" style={{ borderRadius: "16px" }}>
          <div className="modal-header border-0 d-flex align-items-start justify-content-between">
            <div>
              <h5 className="modal-title fw-bold text-dark">Laporkan Konten</h5>
              <small className="text-muted">{title}</small>
            </div>
            <button type="button" className="btn-close shadow-none" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Alasan Pelaporan</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan mengapa konten ini perlu ditinjau..."
                rows={4}
                className="form-control shadow-none"
                style={{ resize: "none", fontSize: "0.9rem" }}
              />
            </div>
          </div>
          <div className="modal-footer border-0 d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-sm btn-light border" onClick={onClose}>Batal</button>
            <button
              type="button"
              disabled={!reason.trim()}
              onClick={() => { onSubmit(reason); onClose(); }}
              className="btn btn-sm btn-danger px-3"
            >
              Kirim Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= COMMENT CARD COMPONENT =================
function CommentCard({
  comment,
  onReply,
  onReport,
  role,
}: {
  comment: Komentar;
  onReply: (commentId: number, text: string) => void;
  onReport: (commentId: number, reason: string) => void;
  role: "guest" | "user" | "admin";
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reported, setReported] = useState(false);

  const authorName = comment.penulis?.username || "Anonim";

  return (
    <div className="card p-3 mb-3 shadow-sm border" style={{ borderRadius: "12px" }}>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "0.75rem" }}>
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="mb-0 fw-bold text-dark small">{authorName}</p>
            <p className="mb-0 text-muted d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
              <Clock size={10} /> {formatDate(comment.tanggalDibuat)}
            </p>
          </div>
        </div>
        {role !== "guest" && (
          <button
            onClick={() => setShowReportModal(true)}
            className={`btn btn-sm border-0 d-flex align-items-center gap-1 ${reported ? "text-danger" : "text-muted"}`}
            style={{ fontSize: "0.75rem" }}
          >
            <Flag size={12} /> {reported ? "Dilaporkan" : "Laporkan"}
          </button>
        )}
      </div>

      <p className="mb-2 text-dark" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>{comment.isi}</p>

      {role !== "guest" && (
        <button
          onClick={() => setReplyOpen(!replyOpen)}
          className="btn btn-sm p-0 text-muted fw-semibold d-flex align-items-center gap-1 border-0 shadow-none"
          style={{ fontSize: "0.8rem" }}
        >
          <MessageSquare size={12} /> {replyOpen ? "Batal Balas" : "Balas"}
        </button>
      )}

      {replyOpen && (
        <div className="mt-2 input-group input-group-sm">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Tulis balasan..."
            className="form-control shadow-none"
          />
          <button
            onClick={() => {
              if (replyText.trim()) {
                onReply(comment.id, replyText);
                setReplyText("");
                setReplyOpen(false);
              }
            }}
            className="btn btn-dark"
          >
            <Send size={12} />
          </button>
        </div>
      )}

      {/* Render Nested Balasan Otomatis dengan proteksi fallback array */}
      {(comment.daftarBalasan || []).length > 0 && (
        <div className="mt-3 ps-3 border-start border-2 space-y-2">
        {(comment.daftarBalasan || []).map((reply) => {
              const replyAuthor = reply.penulis?.username || "Anonim";
      return (
        <div key={reply.id} className="pt-2">
          {/* Konten Balasan */}
        </div>
          );
          })}
        </div>
          )}

      {/* Render Nested Balasan Otomatis dari Struktur JSON Baru */}
      {comment.daftarBalasan && comment.daftarBalasan.length > 0 && (
        <div className="mt-3 ps-3 border-start border-2 space-y-2">
          {comment.daftarBalasan.map((reply) => {
            const replyAuthor = reply.penulis?.username || "Anonim";
            return (
              <div key={reply.id} className="pt-2">
                <div className="d-flex align-items-center gap-2 mb-1 text-muted" style={{ fontSize: "0.75rem" }}>
                  <CornerDownRight size={12} />
                  <span className="fw-bold text-dark">{replyAuthor}</span>
                  <span>·</span>
                  <span>{formatDate(reply.tanggalDibuat)}</span>
                </div>
                <p className="mb-0 ps-4 text-secondary" style={{ fontSize: "0.875rem" }}>{reply.isi}</p>
              </div>
            );
          })}
        </div>
      )}

      {showReportModal && (
        <ReportModal
          title={`komentar dari ${authorName}`}
          onClose={() => setShowReportModal(false)}
          onSubmit={(reason) => {
            onReport(comment.id, reason);
            setReported(true);
          }}
        />
      )}
    </div>
  );
}

// ================= MAIN DETAIL PAGE COMPONENT =================
export function ArticleDetail({ articleId, setView, role, currentUsername }: ArticleDetailProps) {
  const [article, setArticle] = useState<Artikel | null>(null);
  const [comments, setComments] = useState<Komentar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState("");
  const [showReportArticle, setShowReportArticle] = useState(false);
  const [reportedArticle, setReportedArticle] = useState(false);

  // Load Data Artikel & Komentar Terkait dari Java via Single Request
  useEffect(() => {
    if (!articleId) return;
    setLoading(true);
    api.get(`/articles/${articleId}`)
      .then((res) => {
        setArticle(res.data.article || res.data.artikel);
        setComments(res.data.daftarKomentar || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil rincian artikel:", err);
        setLoading(false);
      });
  }, [articleId]);

// 1. Perbaikan Fungsi Like agar State Komentar Tetap Terjaga
  const handleLike = () => {
    if (!article) return;
    api.post(`/articles/${article.id}/like`)
      .then((res) => {
        // Amankan data likes dan pertahankan data komentar lama agar tidak hilang di view
        setArticle(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Silakan login terlebih dahulu.");
          setView("login");
        }
      });
  };

  // 2. Perbaikan Fungsi Tambah Komentar dengan Proteksi Array Kosong
  const handleAddComment = () => {
    if (!newComment.trim() || !article) return;
    api.post(`/articles/${article.id}/komentar`, { isi: newComment })
      .then((res) => {
        // FIX: Pastikan objek komentar baru memiliki array 'daftarBalasan' instan agar tidak memicu crash di CommentCard
        const komentarBaru = {
          ...res.data,
          daftarBalasan: res.data.daftarBalasan || []
        };
        setComments([komentarBaru, ...comments]);
        setNewComment("");
      })
      .catch(() => alert("Gagal mengirim komentar. Pastikan Anda sudah login."));
  };

  const handleReply = (commentId: number, text: string) => {
    if (!article) return;
    api.post(`/articles/${article.id}/komentar/${commentId}/balas`, { isi: text })
      .then((res) => {
        // Update data balasan di state lokal secara instan
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, daftarBalasan: [...c.daftarBalasan, res.data] } : c
        ));
      });
  };

  const handleReportArticle = (reason: string) => {
    if (!article) return;
    api.post(`/articles/${article.id}/report`, { alasan: reason })
      .then(() => setReportedArticle(true));
  };

  const handleReportComment = (commentId: number, reason: string) => {
    if (!article) return;
    api.post(`/articles/${article.id}/komentar/${commentId}/report`, { alasan: reason });
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!article) return <div className="container py-5 text-center"><h5>Artikel tidak ditemukan.</h5></div>;

  const isLiked = article.likes?.some(user => user.username === currentUsername) || false;
  const authorName = article.namaPenulisKustom || article.penulisAkun?.username || "Anonim";

  return (
    <main className="container py-4" style={{ maxWidth: "768px" }}>
      {/* Back Button */}
      <button
        onClick={() => setView("home")}
        className="btn btn-link p-0 text-decoration-none text-muted d-flex align-items-center gap-1 mb-4 shadow-none small"
      >
        <ChevronLeft size={16} /> Kembali ke Daftar Artikel
      </button>

      {/* Header */}
      <header className="mb-4">
        <h1 className="fw-bold text-dark lh-sm h2 mb-3">{article.judul}</h1>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px", fontSize: "0.875rem" }}>
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="mb-0 fw-bold text-dark small">{authorName}</p>
              <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                <Calendar size={11} /> {formatDate(article.tanggalDibuat)}
              </span>
            </div>
          </div>

          <div className="d-flex gap-1">
            {role === "admin" && (
              <button onClick={() => setView("admin-form-edit")} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                <PenSquare size={13} /> Edit
              </button>
            )}
            {role !== "guest" && (
              <button
                onClick={() => !reportedArticle && setShowReportArticle(true)}
                className={`btn btn-sm d-flex align-items-center gap-1 border ${reportedArticle ? "btn-danger bg-opacity-10 text-danger border-danger" : "btn-light"}`}
              >
                <Flag size={13} /> {reportedArticle ? "Dilaporkan" : "Laporkan Artikel"}
              </button>
            )}
          </div>
        </div>
      </header>

      <hr className="text-muted my-3" />

      

      {/* Main Text Content */}
      <div className="mb-4 text-dark fs-6" style={{ lineHeight: "1.8", textAlign: "justify" }}>
        {article.isi.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-3">{paragraph}</p>
        ))}
      </div>

      {/* Like Interation Bar */}
      <div className="d-flex justify-content-center py-3 border-top border-b mb-4">
        <button
          onClick={handleLike}
          className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border ${isLiked ? "btn-danger bg-opacity-10 text-danger border-danger" : "btn-outline-secondary"}`}
          style={{ fontWeight: 500, fontSize: "0.9375rem" }}
        >
          <Heart size={18} fill={isLiked ? "#DC2626" : "none"} stroke={isLiked ? "#DC2626" : "currentColor"} />
          {article.likes ? article.likes.length : 0} Suka
        </button>
      </div>

      {/* System Comment Layout */}
      <section>
        <div className="d-flex align-items-center gap-2 mb-3 text-dark fw-bold h5">
          <MessageSquare size={18} className="text-primary" />
          <span>Komentar ({comments.length})</span>
        </div>

        {/* Input Form Komentar Baru */}
        {role !== "guest" ? (
          <div className="card p-3 mb-4 shadow-sm border" style={{ borderRadius: "12px" }}>
            <div className="d-flex gap-2">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{ width: "32px", height: "32px" }}>
                {(currentUsername || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis komentar Anda..."
                  rows={3}
                  className="form-control border-0 p-0 shadow-none bg-transparent"
                  style={{ resize: "none", fontSize: "0.9rem" }}
                />
                <div className="d-flex justify-content-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="btn btn-sm btn-dark d-flex align-items-center gap-1 px-3"
                  >
                    <Send size={12} /> Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-secondary p-3 d-flex align-items-center gap-2 mb-4" style={{ borderRadius: "12px" }}>
            <User size={16} className="text-muted" />
            <span className="small text-muted">Silakan masuk (login) terlebih dahulu untuk meninggalkan komentar.</span>
          </div>
        )}

        {/* Dynamic Nested Component Comments Mapping */}
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onReport={handleReportComment}
              role={role}
            />
          ))}
        </div>
      </section>

      {showReportArticle && (
        <ReportModal
          title={`"${article.judul}"`}
          onClose={() => setShowReportArticle(false)}
          onSubmit={handleReportArticle}
        />
      )}
    </main>
  );
}