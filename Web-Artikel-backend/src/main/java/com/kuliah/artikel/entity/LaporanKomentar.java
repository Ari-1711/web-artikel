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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "komentar_id")
    // Potong data nested dari Komentar agar JSON dashboard admin tetap ringan
    @JsonIgnoreProperties({"artikel", "daftarBalasan", "penulis"})
    private Komentar komentar;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pengguna_id")
    // Saring data kredensial pelapor demi keamanan
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
    public Pengguna getPelapor() { return pelapor; }
    public void setPelapor(Pengguna pelapor) { this.pelapor = pelapor; }
}