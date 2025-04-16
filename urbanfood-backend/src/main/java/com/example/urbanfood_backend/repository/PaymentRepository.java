package com.example.urbanfood_backend.repository;

import com.example.urbanfood_backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p WHERE " +
            "(:orderId IS NULL OR p.orderId = :orderId) AND " +
            "(:method IS NULL OR p.paymentMethod = :method) AND " +
            "(:date IS NULL OR CAST(p.paymentDate AS date) = :date)")
    List<Payment> findByFilters(
            @Param("orderId") Integer orderId,
            @Param("method") String method,
            @Param("date") LocalDate date);
}