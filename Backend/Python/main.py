from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config.config import DEBUG
from app.services.ml_service import init_models
from app.routes.analysis_router import router as analysis_router

logging.basicConfig(level=logging.INFO if DEBUG else logging.WARNING)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialización de modelos de Machine Learning y preparativos globales
    logger.info("Inicializando modelos YOLO...")
    init_models()
    logger.info("Modelos listos. Servicio en marcha.")
    yield
    logger.info("Apagando servicio...")

app = FastAPI(
    title="Microservicio de Detección de Aves",
    description="API construida con FastAPI y YOLO para la detección y clasificación de especies.",
    version="0.1.0",
    lifespan=lifespan
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Integración de rutas
app.include_router(analysis_router)

@app.get("/")
async def health_check():
    return {"status": "ok", "message": "API de detección activa"}

if __name__ == "__main__":
    import uvicorn
    from app.config.config import HOST_SERVIDOR, PUERTO_SERVIDOR

    # reload_dirs: Solo vigila cambios en la carpeta "app" y el propio archivo "main.py"
    # reload_excludes: Ignora explícitamente logs, cachés y carpetas de configuración
    uvicorn.run(
        "main:app",
        host=HOST_SERVIDOR,
        port=PUERTO_SERVIDOR,
        reload=True,
        reload_dirs=["app", "."],
        reload_excludes=[
            "*.log",
            "*.pyc",
            "__pycache__",
            "runs",
            ".git",
            ".idea",
            ".venv",
            "weights"
        ]
    )
