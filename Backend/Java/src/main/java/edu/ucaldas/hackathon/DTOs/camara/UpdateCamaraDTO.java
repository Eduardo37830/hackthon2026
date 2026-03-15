package edu.ucaldas.hackathon.DTOs.camara;

public record UpdateCamaraDTO(
    String name,
    double angleXY,
    double angleXZ,
    UpdateLocationDTO location
) {
    
}
