package com.clustcare.repository;

import com.clustcare.model.ClusterPatientRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClusterPatientRequestRepository extends JpaRepository<ClusterPatientRequest, Long> {

    /**
     * Find all requests sent by a clinic
     */
    List<ClusterPatientRequest> findByFromClinicId(Long fromClinicId);

    /**
     * Find all requests received by a clinic
     */
    List<ClusterPatientRequest> findByToClinicId(Long toClinicId);

    /**
     * Find all requests (sent or received) by a clinic
     */
    @Query("SELECT r FROM ClusterPatientRequest r WHERE r.fromClinic.id = :clinicId OR r.toClinic.id = :clinicId")
    List<ClusterPatientRequest> findAllByClinicId(@Param("clinicId") Long clinicId);
}
