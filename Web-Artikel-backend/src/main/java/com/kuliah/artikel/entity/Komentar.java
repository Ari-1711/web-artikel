package com.kuliah.artikel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "komentar")
public class Komentar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isi;

    private LocalDateTime tanggalDibuat = LocalDateTime.now();

    // FIX: Samakan gaya pemutusan loop dengan Artikel.java agar data komentar mau muncul di React
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artikel_id", nullable = false)
    @JsonIgnoreProperties({"daftarKomentar", "likes", "handler", "hibernateLazyInitializer"}) 
    private Artikel artikel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pengguna_id", nullable = false)
    @JsonIgnoreProperties({"password", "peran", "handler", "hibernateLazyInitializer"}) 
    private Pengguna penulis;

    @OneToMany(mappedBy = "komentarInduk", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference 
    private List<BalasanKomentar> daftarBalasan = new ArrayList<>();

    // Tambahkan ini di dalam file Komentar.java untuk mengamankan proses hapus komentar
    @OneToMany(mappedBy = "komentar", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"komentar"})
    private java.util.List<LaporanKomentar> daftarLaporanKomentar;

    // Getter & Setter Manual
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIsi() { return isi; }
    public void setIsi(String isi) { this.isi = isi; }

    public LocalDateTime getTanggalDibuat() { return tanggalDibuat; }
    public void setTanggalDibuat(LocalDateTime tanggalDibuat) { this.tanggalDibuat = tanggalDibuat; }

    public Artikel getArtikel() { return artikel; }
    public void setArtikel(Artikel artikel) { this.artikel = artikel; }

    public Pengguna getPenulis() { return penulis; }
    public void setPenulis(Pengguna penulis) { this.penulis = penulis; }

    public List<BalasanKomentar> getDaftarBalasan() { return daftarBalasan; }
    public void setDaftarBalasan(List<BalasanKomentar> daftarBalasan) { this.daftarBalasan = daftarBalasan; }
}