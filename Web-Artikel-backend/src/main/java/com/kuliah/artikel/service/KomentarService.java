package com.kuliah.artikel.service;

import com.kuliah.artikel.entity.Artikel;
import com.kuliah.artikel.entity.Komentar;
import com.kuliah.artikel.entity.Pengguna;
import com.kuliah.artikel.repository.KomentarRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class KomentarService {

    private final KomentarRepository komentarRepository;

    public KomentarService(KomentarRepository komentarRepository) {
        this.komentarRepository = komentarRepository;
    }

    public List<Komentar> ambilKomentarPerArtikel(Long artikelId) {
        return komentarRepository.findByArtikelIdOrderByTanggalDibuatDesc(artikelId);
    }

    public void simpanKomentar(String isi, Artikel artikel, Pengguna penulis) {
        Komentar komentar = new Komentar();
        komentar.setIsi(isi);
        komentar.setArtikel(artikel);
        komentar.setPenulis(penulis);
        komentarRepository.save(komentar);
    }

    // Fungsi khusus Admin untuk menghapus komen buruk
    public void hapusKomentar(Long komentarId) {
        komentarRepository.deleteById(komentarId);
    }
}