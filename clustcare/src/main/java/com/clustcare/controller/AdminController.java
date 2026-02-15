package com.clustcare.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clustcare.model.Clinic;
import com.clustcare.model.Cluster;
import com.clustcare.model.Role;
import com.clustcare.model.User;
import com.clustcare.repository.ClinicRepository;
import com.clustcare.repository.ClusterRepository;
import com.clustcare.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") 
public class AdminController {

    @Autowired
    private ClusterRepository clusterRepository;

    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/clusters")
    public List<Cluster> getAllClusters() {
        return clusterRepository.findAll();
    }

    @PostMapping("/add-clinic")
    public Clinic addClinic(@RequestBody Map<String, String> payload) {
        String clinicName = payload.get("clinicName");
        String username = payload.get("username");
        String password = payload.get("password");
        String location = payload.get("location");
        String clusterType = payload.get("clusterType");
        String clusterName = payload.get("clusterName");
        String district = payload.get("district");

        // 1. Handle Cluster Logic
        Cluster cluster;
        if ("new".equals(clusterType)) {
            Cluster existing = clusterRepository.findByName(clusterName);
            if (existing != null) {
                cluster = existing;
            } else {
                cluster = new Cluster(clusterName, district);
                clusterRepository.save(cluster);
            }
        } else {
            cluster = clusterRepository.findByName(clusterName);
            if (cluster == null) {
                throw new RuntimeException("Cluster not found!");
            }
        }

        // 2. Create the User Login
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken!");
        }

        User newUser = new User();
        // FIXED: Used setFirstName (camelCase) instead of setFirstname
        newUser.setFirstName(clinicName); 
        // FIXED: Used setLastName (camelCase) instead of setLastname
        newUser.setLastName("Admin"); 
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(Role.CLINIC);
        userRepository.save(newUser);

        // 3. Create the Clinic
        Clinic clinic = new Clinic();
        clinic.setName(clinicName);
        clinic.setUsername(username);
        clinic.setPassword("HIDDEN");
        clinic.setLocation(location);
        clinic.setCluster(cluster);
        clinic.setApproved(true);

        return clinicRepository.save(clinic);
    }
    
    @GetMapping("/stats")
    public List<Cluster> getDashboardStats() {
        return clusterRepository.findAll(); 
    }
}