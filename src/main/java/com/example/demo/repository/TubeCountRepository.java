package com.example.demo.repository;

import com.example.demo.domain.TubeCount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TubeCountRepository extends JpaRepository<TubeCount, Long> {
}
