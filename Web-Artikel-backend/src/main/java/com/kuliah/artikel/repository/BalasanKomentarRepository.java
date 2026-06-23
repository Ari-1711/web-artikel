package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.BalasanKomentar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // 👈 PASTIKAN ANOTASI INI ADA
public interface BalasanKomentarRepository extends JpaRepository<BalasanKomentar, Long> {
}