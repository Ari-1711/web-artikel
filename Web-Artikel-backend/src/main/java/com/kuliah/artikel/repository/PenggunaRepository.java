package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.Pengguna;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PenggunaRepository extends JpaRepository<Pengguna, Long> {
    Optional<Pengguna> findByUsername(String username);
}