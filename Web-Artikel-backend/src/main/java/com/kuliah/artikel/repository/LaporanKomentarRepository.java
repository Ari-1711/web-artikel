package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.LaporanKomentar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface LaporanKomentarRepository extends JpaRepository<LaporanKomentar, Long> {
    
    // FIX: Mengubah b.komentarUtama menjadi b.komentarInduk agar sinkron dengan entitas
    @Query("SELECT new map(" +
           "lk.id as id, " +
           "lk.alasan as alasan, " +
           "lk.tanggalDilaporkan as tanggalDilaporkan, " +
           "p.username as pelaporUsername, " +
           "k.id as komentarId, " +
           "k.isi as komentarIsi, " +
           "b.id as balasanId, " +
           "b.isi as balasanIsi, " +
           "COALESCE(k.artikel.id, art.id) as artikelId) " + 
           "FROM LaporanKomentar lk " +
           "LEFT JOIN lk.komentar k " +
           "LEFT JOIN lk.balasanKomentar b " +
           "LEFT JOIN b.komentarInduk ku " +    // 👈 Diubah ke komentarInduk
           "LEFT JOIN ku.artikel art " +  
           "LEFT JOIN lk.pelapor p " +
           "WHERE lk.tanggalDilaporkan >= :waktuMulai " +
           "ORDER BY lk.tanggalDilaporkan DESC")
    List<Map<String, Object>> ambilLaporanKomentarTerbanyak(@Param("waktuMulai") LocalDateTime waktuMulai);
}