package com.example.salonapi.repository;

import com.example.salonapi.entity.Slot;
import com.example.salonapi.entity.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    @Query("SELECT s FROM Slot s join s.availableServices sd WHERE sd.id = :serviceId AND s.status = :status AND s.slotFor BETWEEN :startDate AND :endDate")
    List<Slot> findByServiceAndDate(@Param("serviceId") Long serviceId,
                                    @Param("status") SlotStatus status,
                                    @Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);
}
