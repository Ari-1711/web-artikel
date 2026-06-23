package com.kuliah.artikel.controller;

import com.kuliah.artikel.entity.*;
import com.kuliah.artikel.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ArtikelController {

    private final ArtikelRepository artikelRepository;
    private final PenggunaRepository penggunaRepository;
    private final KomentarRepository komentarRepository;
    private final BalasanKomentarRepository balasanKomentarRepository;
    private final LaporanArtikelRepository laporanArtikelRepository;
    private final LaporanKomentarRepository laporanKomentarRepository;

    public ArtikelController(ArtikelRepository artikelRepository, PenggunaRepository penggunaRepository,
                             KomentarRepository komentarRepository, BalasanKomentarRepository balasanKomentarRepository,
                             LaporanArtikelRepository laporanArtikelRepository, LaporanKomentarRepository laporanKomentarRepository) {
        this.artikelRepository = artikelRepository;
        this.penggunaRepository = penggunaRepository;
        this.komentarRepository = komentarRepository;
        this.balasanKomentarRepository = balasanKomentarRepository;
        this.laporanArtikelRepository = laporanArtikelRepository;
        this.laporanKomentarRepository = laporanKomentarRepository;
    }

    @GetMapping
    public ResponseEntity<List<Artikel>> halamanUtama() {
        return ResponseEntity.ok(artikelRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detailArtikel(@PathVariable Long id) {
        Optional<Artikel> artikelOpt = artikelRepository.findById(id);
        
        if (artikelOpt.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Artikel dengan ID " + id + " tidak ditemukan");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        Artikel artikel = artikelOpt.get();
        List<Komentar> daftarKomentar = komentarRepository.findByArtikelIdOrderByTanggalDibuatDesc(id);

        Map<String, Object> response = new HashMap<>();
        response.put("artikel", artikel);
        response.put("daftarKomentar", daftarKomentar);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeArtikel(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Silakan masuk terlebih dahulu.\"}");
        }
        Artikel artikel = artikelRepository.findById(id).orElse(null);
        if (artikel == null) return ResponseEntity.notFound().build();

        Pengguna user = penggunaRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if (artikel.getLikes().contains(user)) {
            artikel.getLikes().remove(user);
        } else {
            artikel.getLikes().add(user);
        }
        artikelRepository.save(artikel);
        return ResponseEntity.ok(artikel);
    }

    @PostMapping("/{id}/komentar")
    public ResponseEntity<?> kirimKomentar(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Silakan masuk terlebih dahulu.\"}");
        }
        Artikel artikel = artikelRepository.findById(id).orElse(null);
        if (artikel == null) return ResponseEntity.notFound().build();

        Pengguna user = penggunaRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Komentar k = new Komentar();
        k.setIsi(body.get("isi"));
        k.setArtikel(artikel);
        k.setPenulis(user);
        komentarRepository.save(k);

        return ResponseEntity.status(HttpStatus.CREATED).body(k);
    }

    @PostMapping("/{artikelId}/komentar/{komentarId}/balas")
    public ResponseEntity<?> balasKomentar(@PathVariable Long artikelId, @PathVariable Long komentarId, @RequestBody Map<String, String> body, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Silakan masuk terlebih dahulu.\"}");
        }
        Komentar induk = komentarRepository.findById(komentarId).orElse(null);
        if (induk == null) return ResponseEntity.notFound().build();

        Pengguna user = penggunaRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        BalasanKomentar b = new BalasanKomentar();
        b.setIsi(body.get("isi"));
        b.setKomentarInduk(induk);
        b.setPenulis(user);
        balasanKomentarRepository.save(b);

        return ResponseEntity.status(HttpStatus.CREATED).body(b);
    }

    // 1. Endpoint Report Artikel yang Aman, Defensif & Informatif (Versi Duplikat Lama Dibuang)
    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportArtikel(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        Map<String, String> response = new HashMap<>();
        
        if (principal == null) {
            response.put("error", "Silakan masuk terlebih dahulu.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String alasanText = body.get("alasan");
        if (alasanText == null || alasanText.trim().isEmpty()) {
            response.put("error", "Alasan laporan artikel tidak boleh kosong.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Artikel artikel = artikelRepository.findById(id).orElse(null);
        if (artikel == null) {
            response.put("error", "Artikel tidak ditemukan.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Pengguna pelapor = penggunaRepository.findByUsername(principal.getName()).orElse(null);
        if (pelapor == null) {
            response.put("error", "Sesi pengguna tidak valid.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        LaporanArtikel lap = new LaporanArtikel();
        lap.setAlasan(alasanText);
        lap.setArtikel(artikel);
        lap.setPelapor(pelapor);
        laporanArtikelRepository.save(lap);

        response.put("message", "Artikel berhasil dilaporkan");
        return ResponseEntity.ok(response);
    }

    /// 2. Endpoint Report Komentar (Disesuaikan dengan URL React yang membawa ID Artikel)
    // FIX: Tambahkan /{id}/ di depan agar cocok dengan /api/articles/4/komentar/3/report
    @PostMapping("/{id}/komentar/{komentarId}/report")
    public ResponseEntity<?> reportKomentar(@PathVariable Long id, @PathVariable Long komentarId, @RequestBody Map<String, String> body, Principal principal) {
        Map<String, String> response = new HashMap<>();

        if (principal == null) {
            response.put("error", "Silakan masuk terlebih dahulu.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String alasanText = body.get("alasan");
        if (alasanText == null || alasanText.trim().isEmpty()) {
            response.put("error", "Alasan laporan komentar tidak boleh kosong.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Komentar komentar = komentarRepository.findById(komentarId).orElse(null);
        if (komentar == null) {
            response.put("error", "Komentar tidak ditemukan.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Pengguna pelapor = penggunaRepository.findByUsername(principal.getName()).orElse(null);
        if (pelapor == null) {
            response.put("error", "Sesi pengguna tidak valid.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        LaporanKomentar lapKomentar = new LaporanKomentar();
        lapKomentar.setAlasan(alasanText);
        lapKomentar.setKomentar(komentar);
        lapKomentar.setPelapor(pelapor);
        laporanKomentarRepository.save(lapKomentar);

        response.put("message", "Komentar berhasil dilaporkan");
        return ResponseEntity.ok(response);
    }
    // 3. Optimasi: Memanfaatkan kueri database untuk filter terbaru
    @GetMapping("/terbaru")
    public ResponseEntity<List<Artikel>> artikelTerbaru() {
        return ResponseEntity.ok(artikelRepository.findAllByOrderByTanggalDibuatDesc());
    }

    // 4. Optimasi: Memanfaatkan kueri berkinerja tinggi untuk filter teramai
    @GetMapping("/ramai")
    public ResponseEntity<List<Artikel>> artikelRamai() {
        return ResponseEntity.ok(artikelRepository.findArticlesByTrending());
    }

    @PostMapping("/{id}/balasan/{balasanId}/report")
public ResponseEntity<?> reportBalasanKomentar(
        @PathVariable Long id, 
        @PathVariable Long balasanId, 
        @RequestBody Map<String, String> body, 
        Principal principal) {
        
    Map<String, String> response = new HashMap<>();

    if (principal == null) {
        response.put("error", "Silakan masuk terlebih dahulu.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    String alasanText = body.get("alasan");
    if (alasanText == null || alasanText.trim().isEmpty()) {
        response.put("error", "Alasan laporan tidak boleh kosong.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Ganti balasanKomentarRepository sesuai nama bean repository di ArtikelController Anda
    BalasanKomentar balasan = balasanKomentarRepository.findById(balasanId).orElse(null);
    if (balasan == null) {
        response.put("error", "Balasan komentar tidak ditemukan.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    Pengguna pelapor = penggunaRepository.findByUsername(principal.getName()).orElse(null);

    LaporanKomentar lapKomentar = new LaporanKomentar();
    lapKomentar.setAlasan(alasanText);
    lapKomentar.setPelapor(pelapor);
    lapKomentar.setBalasanKomentar(balasan);
    lapKomentar.setKomentar(null); 

    laporanKomentarRepository.save(lapKomentar);

    response.put("message", "Balasan komentar berhasil dilaporkan");
    return ResponseEntity.ok(response);
}
}