package com.kuliah.artikel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "balasan_komentar")
public class BalasanKomentar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isi;

    private LocalDateTime tanggalDibuat = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "komentar_id", nullable = false)
    // Refaktor: Singkirkan @JsonBackReference, gunakan @JsonIgnoreProperties untuk memutus loop di level child
    @JsonIgnoreProperties({"daftarBalasan", "artikel", "handler", "hibernateLazyInitializer"}) 
    private Komentar komentarInduk;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pengguna_id", nullable = false)
    @JsonIgnoreProperties({"password", "peran", "handler", "hibernateLazyInitializer"}) 
    private Pengguna penulis;

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIsi() { return isi; }
    public void setIsi(String isi) { this.isi = isi; }
    public LocalDateTime getTanggalDibuat() { return tanggalDibuat; }
    public void setTanggalDibuat(LocalDateTime tanggalDibuat) { this.tanggalDibuat = tanggalDibuat; }
    public Komentar getKomentarInduk() { return komentarInduk; }
    public void setKomentarInduk(Komentar komentarInduk) { this.komentarInduk = komentarInduk; }
    public Pengguna getPenulis() { return penulis; }
    public void setPenulis(Pengguna penulis) { this.penulis = penulis; }
}