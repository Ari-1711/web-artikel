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
import java.util.List;

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
        // 1. Inisialisasi Peran secara otomatis menggunakan Looping (Lebih bersih & scalable)
        List.of("ROLE_USER", "ROLE_ADMIN").forEach(namaRole -> {
            if (peranRepository.findByNama(namaRole).isEmpty()) {
                Peran peran = new Peran();
                peran.setNama(namaRole);
                peranRepository.save(peran);
            }
        });

        // 2. Buat akun MASTER ADMIN otomatis untuk login pertama kali
        if (penggunaRepository.findByUsername("admin").isEmpty()) {
            Pengguna admin = new Pengguna();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // Password kustom sesuai akun demo awal

            peranRepository.findByNama("ROLE_ADMIN").ifPresent(adminRole -> {
                admin.setPeran(new HashSet<>(Collections.singletonList(adminRole)));
                penggunaRepository.save(admin);
                System.out.println("====== AKUN ADMIN OTOMATIS LAYANAN DIAKTIFKAN (User: admin, Pass: admin123) ======");
            });
        }
    }
}