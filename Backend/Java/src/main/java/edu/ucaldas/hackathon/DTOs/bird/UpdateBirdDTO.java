package edu.ucaldas.hackathon.DTOs.bird;

import java.math.BigDecimal;

public record UpdateBirdDTO(
    BigDecimal probabilityYolo,
    String speciesId,
    String photoId,
    String cameraId
) {

}
