package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.Komentar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KomentarRepository extends JpaRepository<Komentar, Long> {
    List<Komentar> findByArtikelIdOrderByTanggalDibuatDesc(Long artikelId);
}