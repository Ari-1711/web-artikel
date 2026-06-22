package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.LaporanKomentar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface LaporanKomentarRepository extends JpaRepository<LaporanKomentar, Long> {
    
    @Query("SELECT l.komentar.id, l.komentar.isi, COUNT(l.id) as total_report, MAX(l.tanggalDilaporkan) " +
           "FROM LaporanKomentar l WHERE l.tanggalDilaporkan >= :waktuMulai " +
           "GROUP BY l.komentar.id, l.komentar.isi ORDER BY total_report DESC")
    List<Object[]> ambilLaporanKomentarTerbanyak(@Param("waktuMulai") LocalDateTime waktuMulai);
}