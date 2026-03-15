import os
import cv2
import datetime
import logging
import numpy as np
from ultralytics import YOLO

from app.services.supabase_client import save_detections_batch
from app.config.config import (
    RUTA_MODELO_DETECTOR,
    RUTA_MODELO_CLASIFICADOR,
    CLASE_AVES,
    CONFIANZA_DETECTOR,
    CONFIANZA_CLASIFICADOR,
    SUPABASE_TABLE,
    MIN_ANCHO_CAJA,
    MIN_ALTO_CAJA,
    MIN_AREA_RELATIVA,
    SOLO_MEJOR_AVE
)

logger = logging.getLogger(__name__)

# Referencias globales a los modelos cargados
detector = None
clasificador = None

def init_models():
    """Inicializa los modelos YOLO globalmente desde la configuración."""
    global detector, clasificador

    if not os.path.exists(RUTA_MODELO_DETECTOR):
        raise RuntimeError(f"Falta el archivo del modelo detector: {RUTA_MODELO_DETECTOR}")

    if not os.path.exists(RUTA_MODELO_CLASIFICADOR):
        raise RuntimeError(f"Falta el archivo del modelo clasificador: {RUTA_MODELO_CLASIFICADOR}")

    detector = YOLO(RUTA_MODELO_DETECTOR)
    clasificador = YOLO(RUTA_MODELO_CLASIFICADOR)
    
    # Inicializar conexión a DB no es necesario con psycopg2 aquí,
    # se establece en cada llamada a save_detections_batch


def area_relativa(x1, y1, x2, y2, w, h):
    area_caja = max(0, x2 - x1) * max(0, y2 - y1)
    area_frame = w * h
    return area_caja / area_frame if area_frame > 0 else 0

def procesar_frame(bytes_imagen: bytes, id_dispositivo: str, ubicacion: str) -> dict:
    """Ejecuta el pipeline de inferencia YOLO y devuelve las detecciones formateadas."""
    nparr = np.frombuffer(bytes_imagen, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("Imagen no válida o corrupta")

    h, w, _ = frame.shape

    # Detectar objetos (aves)
    # save=False evita guardar imágenes/etiquetas
    # project=None y name=None previenen creación de carpetas 'runs/predict'
    resultados_det = detector.predict(
        frame,
        classes=[CLASE_AVES],
        conf=CONFIANZA_DETECTOR,
        imgsz=1280,
        verbose=False,
        save=False,
        project=None,
        name=None
    )[0]

    candidatas = []

    if resultados_det.boxes is not None and len(resultados_det.boxes) > 0:
        cajas = resultados_det.boxes.xyxy.cpu().numpy()
        confs_det = resultados_det.boxes.conf.cpu().numpy()

        for idx, (caja, conf_det) in enumerate(zip(cajas, confs_det)):
            x1, y1, x2, y2 = map(int, caja)
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)

            ancho = x2 - x1
            alto = y2 - y1
            area_rel = area_relativa(x1, y1, x2, y2, w, h)

            if ancho < MIN_ANCHO_CAJA or alto < MIN_ALTO_CAJA:
                logger.info(f"Caja {idx+1} descartada por tamaño pequeño: {ancho}x{alto}")
                continue

            if area_rel < MIN_AREA_RELATIVA:
                logger.info(f"Caja {idx+1} descartada por área relativa baja: {area_rel:.4f}")
                continue

            recorte = frame[y1:y2, x1:x2]
            if recorte.size == 0:
                continue

            # Clasificar recorte
            # save=False evita que el clasificador cree carpetas
            resultados_cls = clasificador.predict(
                recorte,
                verbose=False,
                save=False,
                project=None,
                name=None
            )[0]

            if resultados_cls.probs is None:
                continue

            indice = int(resultados_cls.probs.top1)
            especie = resultados_cls.names[indice]
            conf_cls = float(resultados_cls.probs.top1conf)

            if conf_cls < CONFIANZA_CLASIFICADOR:
                logger.info(f"Caja {idx+1} descartada por baja confianza de clasificador: {conf_cls:.3f}")
                continue

            score_final = (0.65 * float(conf_det)) + (0.35 * float(conf_cls))

            candidatas.append({
                "especie": especie,
                "confianza": round(conf_cls * 100, 2),
                "confianza_detector": round(float(conf_det) * 100, 2),
                "score_final": round(score_final * 100, 2),
                "coordenadas": [x1, y1, x2, y2]
            })

    if not candidatas:
        return {
            "timestamp": datetime.datetime.now().isoformat(),
            "aves_encontradas": 0,
            "detalles": []
        }

    candidatas.sort(key=lambda x: x["score_final"], reverse=True)

    if SOLO_MEJOR_AVE:
        candidatas = [candidatas[0]]

    # Guardar en Base de Datos (PostgreSQL via psycopg2)
    registros = []
    ahora = datetime.datetime.now().isoformat()

    for ave in candidatas:
        x1, y1, x2, y2 = ave["coordenadas"]
        registros.append({
            "device_id": id_dispositivo,
            "location": ubicacion,
            "especie": ave["especie"],
            "confianza": ave["confianza"], # Confianza del clasificador (%)
            "confianza_detector": ave["confianza_detector"], # Confianza del detector (%)
            "bbox_x1": x1,
            "bbox_y1": y1,
            "bbox_x2": x2,
            "bbox_y2": y2,
            "captured_at": ahora
        })

    if registros:
        save_detections_batch(SUPABASE_TABLE, registros)

    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "aves_encontradas": len(candidatas),
        "detalles": candidatas
    }
