package com.kuliah.artikel.repository;

import com.kuliah.artikel.entity.Peran;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PeranRepository extends JpaRepository<Peran, Long> {
    Optional<Peran> findByNama(String nama);
}