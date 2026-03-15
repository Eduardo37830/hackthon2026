package edu.ucaldas.hackathon.DTOs.camara;

public record UpdateLocationDTO(
    String region,
    String address,
    double latitude,
    double longitude,
    double height
) {
    
}
