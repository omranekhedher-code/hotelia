package com.hotelia.hotelia_backend.option;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<Option, Integer> {

    boolean existsByNomIgnoreCase(String nom);
}