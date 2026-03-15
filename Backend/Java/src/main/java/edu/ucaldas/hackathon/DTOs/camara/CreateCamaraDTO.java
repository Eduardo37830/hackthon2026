package edu.ucaldas.hackathon.DTOs.camara;

public record CreateCamaraDTO(
    String name,
    double angleXY,
    double angleXZ,
    CreateLocationDTO location

) {
    
}
