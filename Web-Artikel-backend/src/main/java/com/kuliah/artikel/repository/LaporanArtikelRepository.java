package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.LaporanArtikel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface LaporanArtikelRepository extends JpaRepository<LaporanArtikel, Long> {
    
    // Taktik Malas & Ampuh: Ambil entitas utuh, urutkan langsung dari database
    @Query("SELECT l FROM LaporanArtikel l " +
           "JOIN FETCH l.artikel a " +
           "LEFT JOIN FETCH l.pelapor p " +
           "WHERE l.tanggalDilaporkan >= :waktuMulai " +
           "ORDER BY l.tanggalDilaporkan DESC")
    List<LaporanArtikel> ambilLaporanArtikelTerbanyak(@Param("waktuMulai") LocalDateTime waktuMulai);
}