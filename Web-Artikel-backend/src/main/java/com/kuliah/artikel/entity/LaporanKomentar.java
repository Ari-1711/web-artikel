package com.kuliah.artikel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "laporan_komentar")
public class LaporanKomentar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String alasan;
    private LocalDateTime tanggalDilaporkan = LocalDateTime.now();

    // Diubah menjadi nullable = true karena konten bisa berupa komentar utama atau balasan
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "komentar_id", nullable = true)
    @JsonIgnoreProperties({"artikel", "daftarBalasan", "penulis"})
    private Komentar komentar;

    // Tambahkan relasi ke BalasanKomentar (Pastikan nama entitas Anda tepat BalasanKomentar)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "balasan_id", nullable = true)
    @JsonIgnoreProperties({"komentarUtama", "penulis", "artikel"}) // Sesuaikan ignore agar JSON tidak looping
    private BalasanKomentar balasanKomentar;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pelapor_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"password", "peran", "handler", "hibernateLazyInitializer"})
    private Pengguna pelapor;

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAlasan() { return alasan; }
    public void setAlasan(String alasan) { this.alasan = alasan; }
    public LocalDateTime getTanggalDilaporkan() { return tanggalDilaporkan; }
    public void setTanggalDilaporkan(LocalDateTime tanggalDilaporkan) { this.tanggalDilaporkan = tanggalDilaporkan; }
    public Komentar getKomentar() { return komentar; }
    public void setKomentar(Komentar komentar) { this.komentar = komentar; }
    
    // Getter & Setter Baru untuk Balasan Komentar
    public BalasanKomentar getBalasanKomentar() { return balasanKomentar; }
    public void setBalasanKomentar(BalasanKomentar balasanKomentar) { this.balasanKomentar = balasanKomentar; }
    
    public Pengguna getPelapor() { return pelapor; }
    public void setPelapor(Pengguna pelapor) { this.pelapor = pelapor; }
}