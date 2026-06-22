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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // FIX: Port Vite 5173 & Izinkan Kredensial Session/Cookie
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
        
        // FIX: Tangani jika artikel tidak ditemukan secara halus agar React tidak crash
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

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportArtikel(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Silakan masuk terlebih dahulu.\"}");
        }
        Artikel artikel = artikelRepository.findById(id).orElse(null);
        if (artikel == null) return ResponseEntity.notFound().build();

        LaporanArtikel lap = new LaporanArtikel();
        lap.setAlasan(body.get("alasan"));
        lap.setArtikel(artikel);
        lap.setPelapor(penggunaRepository.findByUsername(principal.getName()).orElse(null));
        laporanArtikelRepository.save(lap);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Artikel berhasil dilaporkan");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/terbaru")
    public ResponseEntity<List<Artikel>> artikelTerbaru() {
        List<Artikel> listArtikel = artikelRepository.findAll();
        listArtikel.sort((a, b) -> {
            if (a.getTanggalDibuat() == null || b.getTanggalDibuat() == null) return 0;
            return b.getTanggalDibuat().compareTo(a.getTanggalDibuat());
        });
        return ResponseEntity.ok(listArtikel);
    }

    @GetMapping("/ramai")
    public ResponseEntity<List<Artikel>> artikelRamai() {
        List<Artikel> listArtikel = artikelRepository.findAll();
        listArtikel.sort((a, b) -> Integer.compare(b.getJumlahSuka(), a.getJumlahSuka()));
        return ResponseEntity.ok(listArtikel);
    }
}