package com.kuliah.artikel.service;

import com.kuliah.artikel.entity.Pengguna;
import com.kuliah.artikel.entity.Peran;
import com.kuliah.artikel.repository.PenggunaRepository;
import com.kuliah.artikel.repository.PeranRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class PenggunaService {
    private final PenggunaRepository penggunaRepository;
    private final PeranRepository peranRepository;
    private final PasswordEncoder passwordEncoder;

    public PenggunaService(PenggunaRepository penggunaRepository, PeranRepository peranRepository, PasswordEncoder passwordEncoder) {
        this.penggunaRepository = penggunaRepository;
        this.peranRepository = peranRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void daftarUserBaru(String username, String password) {
        Pengguna pengguna = new Pengguna();
        pengguna.setUsername(username);
        // Password wajib dienkripsi sebelum masuk ke DB lokal
        pengguna.setPassword(passwordEncoder.encode(password));

        Peran userRole = peranRepository.findByNama("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Peran tidak ditemukan."));
        pengguna.setPeran(Collections.singleton(userRole));

        penggunaRepository.save(pengguna);
    }
}