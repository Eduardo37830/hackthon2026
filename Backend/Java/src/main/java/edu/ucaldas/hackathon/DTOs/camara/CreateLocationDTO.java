package edu.ucaldas.hackathon.DTOs.camara;

public record CreateLocationDTO(
    String region,
    String address,
    double latitude,
    double longitude,
    double height
) {
    
}
