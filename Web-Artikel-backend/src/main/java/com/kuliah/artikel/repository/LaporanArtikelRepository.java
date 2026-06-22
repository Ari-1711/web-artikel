package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.LaporanArtikel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface LaporanArtikelRepository extends JpaRepository<LaporanArtikel, Long> {
    
    // Perbaikan: mengubah ':waktu Mulai' menjadi ':waktuMulai' tanpa spasi
    @Query("SELECT l.artikel.id, l.artikel.judul, COUNT(l.id) as total_report, MAX(l.tanggalDilaporkan) " +
           "FROM LaporanArtikel l WHERE l.tanggalDilaporkan >= :waktuMulai " +
           "GROUP BY l.artikel.id, l.artikel.judul ORDER BY total_report DESC")
    List<Object[]> ambilLaporanArtikelTerbanyak(@Param("waktuMulai") LocalDateTime waktuMulai);
}