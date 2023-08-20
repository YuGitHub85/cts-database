package com.example.demo.repository;
import com.example.demo.domain.TMC;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TMCRepository extends JpaRepository<TMC, Long> {
    // Additional custom queries can be added here if needed
}
