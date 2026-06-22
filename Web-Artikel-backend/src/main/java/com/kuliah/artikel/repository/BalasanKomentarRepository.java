package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.BalasanKomentar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BalasanKomentarRepository extends JpaRepository<BalasanKomentar, Long> {
    List<BalasanKomentar> findByKomentarIndukIdOrderByTanggalDibuatAsc(Long komentarId);
}