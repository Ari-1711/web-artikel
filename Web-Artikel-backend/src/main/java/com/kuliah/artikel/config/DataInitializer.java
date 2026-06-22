package com.kuliah.artikel.config;

import com.kuliah.artikel.entity.Peran;
import com.kuliah.artikel.entity.Pengguna;
import com.kuliah.artikel.repository.PeranRepository;
import com.kuliah.artikel.repository.PenggunaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PeranRepository peranRepository;
    private final PenggunaRepository penggunaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(PeranRepository peranRepository, PenggunaRepository penggunaRepository, PasswordEncoder passwordEncoder) {
        this.peranRepository = peranRepository;
        this.penggunaRepository = penggunaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Cek dan buat Peran/Role otomatis jika belum ada di DB
        if (peranRepository.findByNama("ROLE_USER").isEmpty()) {
            Peran userRole = new Peran();
            userRole.setNama("ROLE_USER");
            peranRepository.save(userRole);
        }

        if (peranRepository.findByNama("ROLE_ADMIN").isEmpty()) {
            Peran adminRole = new Peran();
            adminRole.setNama("ROLE_ADMIN");
            peranRepository.save(adminRole);
        }

        // 2. Buat akun MASTER ADMIN otomatis untuk login pertama kali
        if (penggunaRepository.findByUsername("admin").isEmpty()) {
            Pengguna admin = new Pengguna();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // Password login: admin123

            Peran adminRole = peranRepository.findByNama("ROLE_ADMIN").get();
            admin.setPeran(new HashSet<>(Collections.singletonList(adminRole)));
            
            penggunaRepository.save(admin);
            System.out.println("====== AKUN ADMIN OTOMATIS LAYANAN DIAKTIFKAN (User: admin, Pass: admin123) ======");
        }
    }
}