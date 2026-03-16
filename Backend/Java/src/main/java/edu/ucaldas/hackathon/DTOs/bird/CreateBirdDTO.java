package edu.ucaldas.hackathon.DTOs.bird;

import java.math.BigDecimal;

public record CreateBirdDTO(
    BigDecimal probabilityYolo,
    String speciesId,
    String photoId,
    String cameraId
) {

}
