# 📰 Panduan Menjalankan Proyek Web Artikel

Repositori ini menggunakan struktur Monorepo yang memisahkan kode sumber menjadi dua folder utama: **Backend (Java Spring Boot)** dan **Frontend (React Vite + TypeScript)**. 

Karena beberapa file konfigurasi lokal dan pustaka (*dependencies*) sengaja tidak diunggah ke GitHub demi efisiensi dan keamanan, ikuti langkah-langkah di bawah ini untuk menjalankannya di laptop Anda.

---

## 🛠️ Prasyarat Sistem
Pastikan laptop Anda sudah terinstal perkakas berikut sebelum memulai:
1. **Node.js** (Versi 18 ke atas / versi LTS terbaru)
2. **Java Development Kit (JDK)** Versi 17 atau yang terbaru
3. **XAMPP** (Untuk mengaktifkan server database MySQL)
4. **Code Editor** (Sangat disarankan menggunakan VS Code)

---

## 🚀 Langkah Demi Langkah Menjalankan Aplikasi

### 1. Persiapan Awal
Kloning repositori ini terlebih dahulu melalui terminal atau Git Bash Anda:
```bash
git clone [https://github.com/Ari-1711/web-artikel.git](https://github.com/Ari-1711/web-artikel.git)
cd web-artikel

```

---

### 2. Konfigurasi & Menjalankan Backend (Java Spring Boot)

1. Buka aplikasi **XAMPP**, lalu klik tombol **Start** pada modul **Apache** dan **MySQL**.
2. Buka browser, akses halaman `http://localhost/phpmyadmin/`.
3. Buat sebuah database baru secara manual dengan nama `db_artikel`.
4. Buka terminal baru di VS Code, lalu masuk ke folder backend:

```bash
   cd Web-Artikel-backend

```

5. Jalankan server backend Spring Boot menggunakan perintah yang sesuai dengan terminal/OS Anda:
* **Jika menggunakan Command Prompt (CMD) Windows:**



```cmd
     mvnw.cmd spring-boot:run
     ```
   * **Jika menggunakan PowerShell Windows / Git Bash / Linux / macOS:**
```bash
     ./mvnw spring-boot:run
     ```
6. **Catatan Penting:** Server backend proyek ini dikonfigurasi berjalan secara aman pada port **`8085`** (`http://localhost:8085`), bukan port default 8080.

---

### 3. Konfigurasi & Menjalankan Frontend (React Vite)
Buka jendela terminal baru di VS Code (pisahkan dari terminal backend yang sedang berjalan), lalu ikuti panduan berikut:

1. Masuk ke folder frontend:
```bash
   cd web-artikel-frontend

```

2. Pasang ulang semua pustaka JavaScript yang dibutuhkan proyek:

```bash
   npm install

```

3. Buat file konfigurasi lingkungan baru bernama **`.env`** tepat di dalam folder root `web-artikel-frontend/` (satu tingkat dengan file `package.json`).
4. Isi file `.env` tersebut dengan baris kode penyelarasan port backend berikut:

```text
   VITE_API_BASE_URL=http://localhost:8085/api

```

5. Jalankan server lokal frontend:

```bash
   npm run dev

```

6. Klik tautan lokal yang muncul di terminal (biasanya **`http://localhost:5173`**) untuk membuka aplikasi di browser Anda.

---

## 🔒 Hak Akses Akun Demo (Login)

* **Peran Admin:** Gunakan username `admin` (Dapat mengakses penuh Dashboard Admin untuk menulis, mengubah, dan menghapus artikel).
* **Peran Pengguna Biasa:** Anda bisa menggunakan fitur **Daftar Sekarang** langsung pada halaman login untuk membuat akun pembaca baru.

