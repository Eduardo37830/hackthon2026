package edu.ucaldas.hackathon.DTOs.camara;

public record GetCamaraDTO(
    String id,
    String name,
    double angleXY,
    double angleXZ,
    GetLocationDTO location
) {
    
}
