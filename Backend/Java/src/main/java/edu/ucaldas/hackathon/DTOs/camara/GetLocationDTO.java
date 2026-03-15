package edu.ucaldas.hackathon.DTOs.camara;

public record GetLocationDTO(
    String region,
    String address,
    double latitude,
    double longitude,
    double height
) {
    
}
