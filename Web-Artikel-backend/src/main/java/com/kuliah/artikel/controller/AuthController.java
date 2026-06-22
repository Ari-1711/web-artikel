package com.kuliah.artikel.controller;

import com.kuliah.artikel.service.PenggunaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // FIX: Port Vite 5173 & Izinkan Kredensial Cookie
public class AuthController {

    private final PenggunaService penggunaService;

    public AuthController(PenggunaService penggunaService) {
        this.penggunaService = penggunaService;
    }

    @PostMapping("/daftar")
    public ResponseEntity<Map<String, String>> prosesDaftar(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        String username = body.get("username");
        String password = body.get("password");

        // Validasi minimalis agar data kosong tidak masuk ke DB
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            response.put("error", "Username dan password tidak boleh kosong");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            penggunaService.daftarUserBaru(username, password);
            response.put("message", "Pendaftaran berhasil. Silakan masuk.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "Pendaftaran gagal: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}