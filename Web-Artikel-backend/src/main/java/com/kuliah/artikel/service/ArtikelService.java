package com.kuliah.artikel.service;

import com.kuliah.artikel.entity.Artikel;
import com.kuliah.artikel.entity.Pengguna;
import com.kuliah.artikel.repository.ArtikelRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ArtikelService {
    private final ArtikelRepository artikelRepository;

    public ArtikelService(ArtikelRepository artikelRepository) {
        this.artikelRepository = artikelRepository;
    }

    public List<Artikel> ambilSemuaArtikel() {
        return artikelRepository.findAll();
    }

    public List<Artikel> ambilArtikelSaya(Long id) {
        return artikelRepository.findByPenulisAkunId(id);
    }

    // Perbaikan: Tambahkan logika pengkondisian edit agar lebih aman
    public void simpanArtikel(Artikel artikel, Pengguna penulis) {
        if (artikel.getId() != null) {
            // Jika ID ada, berarti ini proses EDIT/UPDATE
            Optional<Artikel> artikelLamaOpt = artikelRepository.findById(artikel.getId());
            if (artikelLamaOpt.isPresent()) {
                Artikel dataLama = artikelLamaOpt.get();
                dataLama.setJudul(artikel.getJudul());
                dataLama.setIsi(artikel.getIsi());
                dataLama.setNamaPenulisKustom(artikel.getNamaPenulisKustom());
                // Pertahankan penulis asli dan tanggal pembuatan aslinya agar tidak null
                artikelRepository.save(dataLama);
                return;
            }
        }
        
        // Jika ID tidak ada, berarti ini proses TAMBAH BARU
        artikel.setPenulisAkun(penulis);
        artikelRepository.save(artikel);
    }

    public void hapusArtikel(Long id) {
        if (artikelRepository.existsById(id)) {
            artikelRepository.deleteById(id);
        }
    }
}