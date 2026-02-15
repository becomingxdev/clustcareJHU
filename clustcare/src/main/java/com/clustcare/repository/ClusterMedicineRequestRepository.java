package com.clustcare.repository;

import com.clustcare.model.ClusterMedicineRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClusterMedicineRequestRepository extends JpaRepository<ClusterMedicineRequest, Long> {

    /**
     * Find all requests sent by a clinic
     */
    List<ClusterMedicineRequest> findByFromClinicId(Long fromClinicId);

    /**
     * Find all requests received by a clinic
     */
    List<ClusterMedicineRequest> findByToClinicId(Long toClinicId);

    /**
     * Find all requests (sent or received) by a clinic
     */
    @Query("SELECT r FROM ClusterMedicineRequest r WHERE r.fromClinic.id = :clinicId OR r.toClinic.id = :clinicId")
    List<ClusterMedicineRequest> findAllByClinicId(@Param("clinicId") Long clinicId);
}
