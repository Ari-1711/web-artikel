package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.Artikel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArtikelRepository extends JpaRepository<Artikel, Long> {
    
    // 1. Filter Terbaru: Urutkan berdasarkan tanggal dibuat paling baru
    List<Artikel> findAllByOrderByTanggalDibuatDesc();

    // 2. Filter Ramai: Urutkan berdasarkan artikel yang paling banyak memiliki interaksi LIKE
    @Query("SELECT a FROM Artikel a LEFT JOIN a.likes l GROUP BY a.id ORDER BY COUNT(l) DESC, a.tanggalDibuat DESC")
    List<Artikel> findArticlesByTrending();

    List<Artikel> findByPenulisAkunId(Long akunId);
}