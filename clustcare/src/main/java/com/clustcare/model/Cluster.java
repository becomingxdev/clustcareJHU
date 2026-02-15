package com.clustcare.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; // <--- NEW IMPORT
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "clusters")
public class Cluster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String district;

    @OneToMany(mappedBy = "cluster", cascade = CascadeType.ALL)
    @JsonManagedReference // <--- CHANGED: Allows the list to be sent to Frontend
    private List<Clinic> clinics;

    public Cluster(String name, String district) {
        this.name = name;
        this.district = district;
    }
}