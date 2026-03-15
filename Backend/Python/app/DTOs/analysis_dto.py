from pydantic import BaseModel, Field
from typing import List

class EspecieDetalle(BaseModel):
    especie: str
    confianza: float
    confianza_detector: float
    score_final: float
    coordenadas: List[int]

class AnalisisResponseDTO(BaseModel):
    timestamp: str
    aves_encontradas: int
    detalles: List[EspecieDetalle]
