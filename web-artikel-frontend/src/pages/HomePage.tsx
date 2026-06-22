import { useState, useEffect } from "react";
import api from "../services/api";
import { Heart, Clock, Sparkles, Flame, Home, ChevronRight, PenSquare, FileText } from "lucide-react";

interface Pengguna {
  id: number;
  username: string;
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

interface HomePageProps {
  filterView: "all" | "newest" | "trending";
  setFilterView: (f: "all" | "newest" | "trending") => void;
  setView: (v: string) => void;
  setSelectedArticleId: (id: number) => void;
  role: "user" | "admin";
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

function ArticleCard({
  article,
  onOpenDetail,
  onLike,
  currentUsername,
  featured = false,
}: {
  article: Artikel;
  onOpenDetail: () => void;
  onLike: () => void;
  currentUsername?: string;
  featured?: boolean;
}) {
  const isLiked = article.likes?.some(user => user.username === currentUsername) || false;
  const totalLikes = article.likes ? article.likes.length : 0;
  const namaPenulis = article.namaPenulisKustom || article.penulisAkun?.username || "Anonim";

  if (featured) {
    return (
      <article
        className="card mb-4 overflow-hidden border shadow-sm cursor-pointer group"
        onClick={onOpenDetail}
        style={{ borderRadius: "12px" }}
      >
        <div className="row g-0">
          <div className="col-md-6 bg-light position-relative overflow-hidden" style={{ minHeight: "260px" }}>
            <img
              src={article.urlGambar || "https://images.unsplash.com/photo-1495020689067-958852a6565d?q=80&w=600"}
              alt={article.judul}
              className="w-100 h-100 object-cover"
              style={{ minHeight: "260px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6 p-4 d-flex flex-column justify-content-center gap-3">
            <span className="badge bg-danger bg-opacity-10 text-danger align-self-start d-flex align-items-center gap-1 px-2 py-1 text-uppercase" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              <Sparkles size={10} /> Pilihan Editor
            </span>
            <h2 className="card-title h3 fw-bold text-dark">
              {article.judul}
            </h2>
            <p className="card-text text-secondary" style={{ fontSize: "0.9375rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {article.isi}
            </p>
            <div className="d-flex align-items-center justify-content-between pt-2">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "0.875rem" }}>
                  {namaPenulis.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="mb-0 fw-bold text-dark" style={{ fontSize: "0.8125rem" }}>{namaPenulis}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{formatDate(article.tanggalDibuat)}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onLike(); }}
                className="btn btn-sm d-flex align-items-center gap-1 px-3 py-1.5 rounded-pill border-0 text-decoration-none"
                style={{
                  color: isLiked ? "#DC2626" : "#6B7280",
                  backgroundColor: isLiked ? "#FEF2F2" : "#F3F4F6",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                }}
              >
                <Heart size={13} fill={isLiked ? "#DC2626" : "none"} stroke={isLiked ? "#DC2626" : "currentColor"} />
                {totalLikes}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="card h-100 p-3 border shadow-sm cursor-pointer d-flex flex-row gap-3"
      onClick={onOpenDetail}
      style={{ borderRadius: "12px" }}
    >

      <div className="flex-grow-1 min-w-0 d-flex flex-column gap-1">
        <h3 className="h6 card-title fw-bold text-dark mb-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.judul}
        </h3>
        <p className="text-secondary mb-2 small" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.isi}
        </p>
        <div className="d-flex align-items-center justify-content-between mt-auto pt-1">
          <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "0.72rem" }}>
            <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: "80px" }}>{namaPenulis}</span>
            <span>·</span>
            <span className="d-flex align-items-center gap-1"><Clock size={10} />{formatDate(article.tanggalDibuat)}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className="btn btn-sm d-flex align-items-center gap-1 px-2 py-0.5 rounded-pill border-0"
            style={{
              color: isLiked ? "#DC2626" : "#6B7280",
              backgroundColor: isLiked ? "#FEF2F2" : "transparent",
              fontSize: "0.75rem",
            }}
          >
            <Heart size={11} fill={isLiked ? "#DC2626" : "none"} stroke={isLiked ? "#DC2626" : "currentColor"} />
            {totalLikes}
          </button>
        </div>
      </div>
    </article>
  );
}

export function HomePage({
  filterView,
  setFilterView,
  setView,
  setSelectedArticleId,
  role,
  currentUsername,
}: HomePageProps) {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    let endpoint = "/articles";
    if (filterView === "newest") endpoint = "/articles/terbaru";
    if (filterView === "trending") endpoint = "/articles/ramai";

    api.get(endpoint)
      .then((response) => {
        setArticles(response.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal memuat artikel dari server:", error);
        setLoading(false);
      });
  }, [filterView]);

  const handleLike = (id: number) => {
    api.post(`/articles/${id}/like`)
      .then((response) => {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? response.data : a))
        );
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Silakan masuk (login) terlebih dahulu untuk menyukai artikel.");
          setView("login");
        }
      });
  };

  const handleOpenDetail = (id: number) => {
    setSelectedArticleId(id);
    setView("detail");
  };

  // FIX: Pembagian data yang kokoh dan aman dari kondisi array kosong
  const featured = articles.length > 0 ? articles[0] : null;
  const rest = articles.length > 1 ? articles.slice(1) : [];

  const headerConfig = {
    all: { icon: <Home size={20} />, label: "Semua Artikel", desc: "Kumpulan tulisan terkini dari redaksi Web Artikel." },
    newest: { icon: <Sparkles size={20} />, label: "Artikel Terbaru", desc: "Artikel yang baru saja diterbitkan oleh tim redaksi." },
    trending: { icon: <Flame size={20} />, label: "Artikel Ramai", desc: "Artikel paling banyak mendapat respons dari pembaca." },
  };
  const { icon, label, desc } = headerConfig[filterView];

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div><p className="mt-2 text-muted">Memuat artikel...</p></div>;
  }

  return (
    <main className="container py-4" style={{ maxWidth: "1140px" }}>
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border bg-light text-primary">
            {icon}
            <span className="fw-bold" style={{ fontSize: "0.9375rem" }}>{label}</span>
          </div>
        </div>
        <p className="text-muted small mb-3">{desc}</p>

        {/* Filter Pills */}
        <div className="d-flex align-items-center gap-2 mb-4">
          {(["all", "newest", "trending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterView(f)}
              className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5 border ${
                filterView === f ? "btn-primary fw-bold" : "btn-outline-secondary"
              }`}
              style={{ fontSize: "0.8125rem" }}
            >
              {f === "all" && <><Home size={12} /> Semua</>}
              {f === "newest" && <><Sparkles size={12} /> Terbaru</>}
              {f === "trending" && <><Flame size={12} /> Ramai</>}
            </button>
          ))}
        </div>
      </div>

      {/* FIX: Tampilan Jika Database Masih Kosong Total */}
      {articles.length === 0 ? (
        <div className="text-center py-5 border rounded bg-white p-4" style={{ borderStyle: "dashed" }}>
          <FileText size={40} className="text-muted mb-2 mx-auto d-block" />
          <h5 className="fw-bold text-dark">Belum Ada Artikel</h5>
          <p className="text-muted small mb-0">Silakan login sebagai admin untuk mulai mengisi konten pertama.</p>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featured && (
            <div className="mb-4">
              <ArticleCard
                article={featured}
                onOpenDetail={() => handleOpenDetail(featured.id)}
                onLike={() => handleLike(featured.id)}
                currentUsername={currentUsername}
                featured
              />
            </div>
          )}

          {/* Article Grid Layout Bootstrap */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {rest.map((article) => (
              <div className="col" key={article.id}>
                <ArticleCard
                  article={article}
                  onOpenDetail={() => handleOpenDetail(article.id)}
                  onLike={() => handleLike(article.id)}
                  currentUsername={currentUsername}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Admin CTA Section */}
      {role === "admin" && (
        <div className="mt-5 d-flex align-items-center justify-content-between p-4 bg-light rounded border border-dashed border-primary">
          <div>
            <p className="mb-0 fw-bold text-dark" style={{ fontSize: "0.9375rem" }}>Anda masuk sebagai Admin</p>
            <p className="mb-0 text-muted small">Tambah artikel baru atau kelola laporan konten melalui dashboard.</p>
          </div>
          <div className="d-flex gap-2">
            <button onClick={() => setView("admin-dashboard")} className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1">
              Dashboard <ChevronRight size={13} />
            </button>
            <button onClick={() => setView("admin-form-new")} className="btn btn-sm btn-primary d-flex align-items-center gap-1">
              <PenSquare size={13} /> Tulis Artikel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}