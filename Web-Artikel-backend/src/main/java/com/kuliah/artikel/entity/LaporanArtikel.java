// Pastikan package tetap com.kuliah.artikel.entity jika ini typo saat copy-paste
package com.kuliah.artikel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "laporan_artikel")
public class LaporanArtikel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String alasan;
    private LocalDateTime tanggalDilaporkan = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artikel_id")
    // Hindari artikel merender ulang list komentar atau likes-nya di dalam data laporan admin
    @JsonIgnoreProperties({"daftarKomentar", "likes", "penulisAkun"}) 
    private Artikel artikel;

    @ManyToOne(fetch = FetchType.EAGER)
    // Paksa Hibernate mengisi kolom pelapor_id di MySQL, bukan pengguna_id
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
    public Artikel getArtikel() { return artikel; }
    public void setArtikel(Artikel artikel) { this.artikel = artikel; }
    public Pengguna getPelapor() { return pelapor; }
    public void setPelapor(Pengguna pelapor) { this.pelapor = pelapor; }
}