import { type FC, useMemo } from 'react'
import { Zap, Eye, Brain } from 'lucide-react'
import type { BirdDetection } from '../services/analysis.service'
import { getSpeciesDisplayName, getConfidenceColor } from '../services/analysis.service'
import './BirdDetectionCard.css'

interface BirdDetectionCardProps {
  readonly detection: BirdDetection
  readonly index: number
  readonly videoDimensions: { width: number; height: number }
  readonly onImageClick?: (detection: BirdDetection) => void
}

export const BirdDetectionCard: FC<BirdDetectionCardProps> = ({
  detection,
  index,
  videoDimensions,
  onImageClick,
}) => {
  const displayName = useMemo(
    () => getSpeciesDisplayName(detection.especie),
    [detection.especie],
  )

  const confidenceColor = useMemo(
    () => getConfidenceColor(detection.confianza),
    [detection.confianza],
  )

  const detectionBounds = useMemo(() => {
    if (videoDimensions.width === 0 || videoDimensions.height === 0) {
      return { left: 0, top: 0, width: 0, height: 0 }
    }

    const [x1, y1, x2, y2] = detection.coordenadas
    return {
      left: (x1 / videoDimensions.width) * 100,
      top: (y1 / videoDimensions.height) * 100,
      width: ((x2 - x1) / videoDimensions.width) * 100,
      height: ((y2 - y1) / videoDimensions.height) * 100,
    }
  }, [detection.coordenadas, videoDimensions])

  return (
    <>
      {/* Caja de detección superpuesta en el video */}
      <div
        className="bird-detection-box"
        style={{
          position: 'absolute',
          left: `${detectionBounds.left}%`,
          top: `${detectionBounds.top}%`,
          width: `${detectionBounds.width}%`,
          height: `${detectionBounds.height}%`,
          border: `3px solid ${confidenceColor}`,
          boxShadow: `0 0 10px ${confidenceColor}`,
          zIndex: 10,
        }}
      >
        <div
          className="bird-detection-label"
          style={{
            position: 'absolute',
            top: '-32px',
            left: '-3px',
            backgroundColor: confidenceColor,
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px 4px 0 0',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          #{index + 1} {displayName}
        </div>

        {/* Confidence badge */}
        <div
          className="bird-confidence-badge"
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: confidenceColor,
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          {detection.confianza.toFixed(0)}%
        </div>
      </div>

      {/* Tarjeta de información de la detección */}
      <div className="bird-detection-card">
        {/* Imagen de detección */}
        <div
          className="bird-detection-image-container"
          onClick={() => onImageClick?.(detection)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onImageClick?.(detection)}
        >
          <img
            src={detection.foto_base64}
            alt={detection.especie}
            className="bird-detection-image"
          />
          <div className="bird-detection-image-overlay">
            <Eye size={24} />
          </div>
        </div>

        {/* Información de la especie */}
        <div className="bird-detection-info">
          <h3 className="bird-detection-species" title={detection.especie}>
            {displayName}
          </h3>

          {/* Métricas de confianza */}
          <div className="bird-detection-metrics">
            <div className="metric">
              <div className="metric-label">
                <Brain size={14} />
                Clasificador
              </div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${detection.confianza}%`,
                    backgroundColor: getConfidenceColor(detection.confianza),
                  }}
                />
              </div>
              <div className="metric-value">{detection.confianza.toFixed(1)}%</div>
            </div>

            <div className="metric">
              <div className="metric-label">
                <Zap size={14} />
                Detector YOLO
              </div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${detection.confianza_detector}%`,
                    backgroundColor: getConfidenceColor(detection.confianza_detector),
                  }}
                />
              </div>
              <div className="metric-value">
                {detection.confianza_detector.toFixed(1)}%
              </div>
            </div>

            <div className="metric">
              <div className="metric-label">
                <Brain size={14} />
                Score Final
              </div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${detection.score_final}%`,
                    backgroundColor: getConfidenceColor(detection.score_final),
                  }}
                />
              </div>
              <div className="metric-value">{detection.score_final.toFixed(1)}%</div>
            </div>
          </div>

          {/* Coordenadas */}
          <div className="bird-detection-coordinates">
            <small>
              Posición: ({detection.coordenadas[0]}, {detection.coordenadas[1]}) -{' '}
              ({detection.coordenadas[2]}, {detection.coordenadas[3]})
            </small>
          </div>
        </div>
      </div>
    </>
  )
}
