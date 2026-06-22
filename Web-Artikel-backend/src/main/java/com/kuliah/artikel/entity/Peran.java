package com.kuliah.artikel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "peran")
public class Peran {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nama;

    // Getter & Setter Manual
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
}