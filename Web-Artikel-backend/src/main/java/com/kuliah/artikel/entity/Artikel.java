package com.kuliah.artikel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Entity
@Table(name = "artikel")
public class Artikel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String judul;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isi;

    private String namaPenulisKustom;

    private LocalDateTime tanggalDibuat = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "pengguna_id")
    @JsonIgnoreProperties({"password", "peran", "handler", "hibernateLazyInitializer"})
    private Pengguna penulisAkun;

    @ManyToMany
    @JoinTable(
        name = "artikel_likes",
        joinColumns = @JoinColumn(name = "artikel_id"),
        inverseJoinColumns = @JoinColumn(name = "pengguna_id")
    )
    @JsonIgnoreProperties({"password", "peran", "handler", "hibernateLazyInitializer"})
    private Set<Pengguna> likes = new HashSet<>();

    @OneToMany(mappedBy = "artikel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"artikel", "handler", "hibernateLazyInitializer"})
    private List<Komentar> daftarKomentar;

    @OneToMany(mappedBy = "artikel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"artikel"})
    private List<LaporanArtikel> daftarLaporan;

    @Transient
    public int getJumlahSuka() {
        return this.likes != null ? this.likes.size() : 0;
    }

    // Getter & Setter (Hanya yang esensial)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
    public String getIsi() { return isi; }
    public void setIsi(String isi) { this.isi = isi; }
    public String getNamaPenulisKustom() { return namaPenulisKustom; }
    public void setNamaPenulisKustom(String namaPenulisKustom) { this.namaPenulisKustom = namaPenulisKustom; }
    public LocalDateTime getTanggalDibuat() { return tanggalDibuat; }
    public void setTanggalDibuat(LocalDateTime tanggalDibuat) { this.tanggalDibuat = tanggalDibuat; }
    public Pengguna getPenulisAkun() { return penulisAkun; }
    public void setPenulisAkun(Pengguna penulisAkun) { this.penulisAkun = penulisAkun; }
    public Set<Pengguna> getLikes() { return likes; }
    public void setLikes(Set<Pengguna> likes) { this.likes = likes; }
}