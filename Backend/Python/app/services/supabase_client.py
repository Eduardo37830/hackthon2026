import logging
import psycopg2
from psycopg2.extras import execute_values
from app.config.config import DATABASE_URL

logger = logging.getLogger(__name__)

def save_detections_batch(table_name: str, records: list[dict]):
    """
    Guarda una lista de detecciones en la base de datos PostgreSQL.
    Si DATABASE_URL no está configurada, registra una advertencia y retorna.
    """
    if not DATABASE_URL:
        # Solo loguear una vez o si es realmente necesario, para evitar spam
        logger.warning("DATABASE_URL no configurada. Omitiendo guardado en BD.")
        return

    if not records:
        return

    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)

        # Asumiendo que todos los registros tienen las mismas claves (estructura uniforme)
        if not records:
            return

        columns = list(records[0].keys())
        # Columnas separadas por coma: "col1, col2, col3"
        columns_str = ", ".join(columns)

        # Preparar los valores como lista de tuplas para execute_values
        values = [tuple(record[col] for col in columns) for record in records]

        # Query de inserción masiva
        # VALUES %s es el marcador que usa execute_values
        query = f"INSERT INTO {table_name} ({columns_str}) VALUES %s"

        with conn.cursor() as cursor:
            execute_values(cursor, query, values)
            conn.commit()
            logger.info(f"Guardados {len(records)} avistamientos en tabla '{table_name}'.")

    except Exception as e:
        logger.error(f"Error al guardar en PostgreSQL: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


