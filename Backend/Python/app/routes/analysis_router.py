from fastapi import APIRouter, File, UploadFile, Form
from app.controllers.analysis_controller import analizar_frame_controller
from app.DTOs.analysis_dto import AnalisisResponseDTO

router = APIRouter(
    tags=["Análisis de Aves"]
)

@router.post("/analizar_frame", response_model=AnalisisResponseDTO)
async def endpoint_analizar_frame(
    archivo: UploadFile = File(...),
    id_dispositivo: str = Form("Desconocido"),
    ubicacion: str = Form("Desconocida")
):
    """
    Recibe una imagen (frame) y devuelve las detecciones de aves usando YOLO.
    """
    return await analizar_frame_controller(archivo, id_dispositivo, ubicacion)
