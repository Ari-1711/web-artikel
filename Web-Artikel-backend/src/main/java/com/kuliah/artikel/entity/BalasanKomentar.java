package com.kuliah.artikel.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JsonBackReference // Putus sirkular reference ke arah Komentar Induk
    // FIX: Tambahkan ini untuk mengamankan proxy lazy loading Hibernate saat konversi JSON
    @JsonIgnoreProperties({"handler", "hibernateLazyInitializer"}) 
    private Komentar komentarInduk;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pengguna_id", nullable = false)
    @JsonIgnoreProperties({"password", "peran", "handler", "hibernateLazyInitializer"}) 
    private Pengguna penulis;

    // ... sisa kode bawah (Getter & Setter) tetap sama ...

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