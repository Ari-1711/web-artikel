package com.kuliah.artikel.controller;

import com.kuliah.artikel.entity.Artikel;
import com.kuliah.artikel.entity.BalasanKomentar;
import com.kuliah.artikel.entity.LaporanKomentar;
import com.kuliah.artikel.entity.Pengguna;
import com.kuliah.artikel.repository.ArtikelRepository;
import com.kuliah.artikel.repository.KomentarRepository;
import com.kuliah.artikel.repository.BalasanKomentarRepository; // 👈 Tambah import ini
import com.kuliah.artikel.repository.PenggunaRepository;
import com.kuliah.artikel.repository.LaporanArtikelRepository;
import com.kuliah.artikel.repository.LaporanKomentarRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final ArtikelRepository artikelRepository;
    private final PenggunaRepository penggunaRepository;
    private final LaporanArtikelRepository laporanArtikelRepository;
    private final LaporanKomentarRepository laporanKomentarRepository;
    private final KomentarRepository komentarRepository;
    private final BalasanKomentarRepository balasanKomentarRepository; // 👈 Tambah field ini

    public AdminController(ArtikelRepository artikelRepository, PenggunaRepository penggunaRepository,
                           LaporanArtikelRepository laporanArtikelRepository, LaporanKomentarRepository laporanKomentarRepository,
                           KomentarRepository komentarRepository, BalasanKomentarRepository balasanKomentarRepository) { // 👈 Tambah di parameter
        this.artikelRepository = artikelRepository;
        this.penggunaRepository = penggunaRepository;
        this.laporanArtikelRepository = laporanArtikelRepository;
        this.laporanKomentarRepository = laporanKomentarRepository;
        this.komentarRepository = komentarRepository;
        this.balasanKomentarRepository = balasanKomentarRepository; // 👈 Assign ke field
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboardAdmin(@RequestParam(defaultValue = "all") String filterWaktu) {
        LocalDateTime batasWaktu = LocalDateTime.now().minusYears(10);
        
        if (filterWaktu.equals("hari")) batasWaktu = LocalDateTime.now().minusDays(1);
        else if (filterWaktu.equals("minggu")) batasWaktu = LocalDateTime.now().minusWeeks(1);
        else if (filterWaktu.equals("bulan")) batasWaktu = LocalDateTime.now().minusMonths(1);

        Map<String, Object> response = new HashMap<>();
        response.put("laporanArtikel", laporanArtikelRepository.ambilLaporanArtikelTerbanyak(batasWaktu));
        response.put("laporanKomentar", laporanKomentarRepository.ambilLaporanKomentarTerbanyak(batasWaktu));
        response.put("filterAktif", filterWaktu);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/artikel/{id}")
    public ResponseEntity<?> dapatkanArtikelDetail(@PathVariable Long id) {
        Artikel artikel = artikelRepository.findById(id).orElse(null);
        if (artikel == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Artikel tidak ditemukan");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        return ResponseEntity.ok(artikel);
    }

    @PostMapping("/artikel/simpan")
    public ResponseEntity<Map<String, String>> simpanArtikel(@RequestBody Artikel artikel, Principal principal) {
        Map<String, String> response = new HashMap<>();
        
        // 1. Fitur EDIT ARTIKEL
        if (artikel.getId() != null) {
            Artikel dataLama = artikelRepository.findById(artikel.getId()).orElse(null);
            if (dataLama == null) {
                response.put("error", "Artikel yang akan diedit tidak ditemukan");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            dataLama.setJudul(artikel.getJudul());
            dataLama.setIsi(artikel.getIsi());
            dataLama.setNamaPenulisKustom(artikel.getNamaPenulisKustom());
            artikelRepository.save(dataLama);
            response.put("message", "Artikel berhasil diperbarui");
            return ResponseEntity.ok(response);
        } 
        
        // 2. Fitur TAMBAH ARTIKEL BARU
        if (principal == null) {
            response.put("error", "Akses ditolak. Anda harus login sebagai admin.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        penggunaRepository.findByUsername(principal.getName()).ifPresent(artikel::setPenulisAkun);
        
        if (artikel.getPenulisAkun() == null) {
            response.put("error", "Akun penulis tidak ditemukan di database.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        artikelRepository.save(artikel);
        response.put("message", "Artikel baru berhasil ditambahkan");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/artikel/hapus/{id}")
    public ResponseEntity<Map<String, String>> hapusArtikel(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        if (!artikelRepository.existsById(id)) {
            response.put("error", "Artikel tidak ditemukan");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        artikelRepository.deleteById(id);
        response.put("message", "Artikel berhasil dihapus");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/komentar/hapus/{id}")
    public ResponseEntity<Map<String, String>> hapusKomentarDariAdmin(@PathVariable Long id) {
        komentarRepository.deleteById(id); 
        Map<String, String> response = new HashMap<>();
        response.put("message", "Komentar buruk berhasil dihapus oleh admin");
        return ResponseEntity.ok(response);
    }

    // 👈 TAMBAHKAN ENDPOINT INI: Untuk menghapus balasan komentar dari panel admin
    @DeleteMapping("/balasan/hapus/{id}")
    public ResponseEntity<Map<String, String>> hapusBalasanDariAdmin(@PathVariable Long id) {
        balasanKomentarRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Balasan komentar buruk berhasil dihapus oleh admin");
        return ResponseEntity.ok(response);
    }

    
}