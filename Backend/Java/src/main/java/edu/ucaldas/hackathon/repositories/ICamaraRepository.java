package edu.ucaldas.hackathon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ucaldas.hackathon.models.Camara;

public interface ICamaraRepository extends JpaRepository<Camara, String> {
    
}
