package com.kuliah.artikel.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "pengguna")
public class Pengguna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // Mencegah password bocor ke REST API / JSON response
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "pengguna_peran",
        joinColumns = @JoinColumn(name = "pengguna_id"),
        inverseJoinColumns = @JoinColumn(name = "peran_id")
    )
    private Set<Peran> peran;

    // Getter & Setter Manual
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<Peran> getPeran() { return peran; }
    public void setPeran(Set<Peran> peran) { this.peran = peran; }
}