import { type FC, useMemo } from 'react'
import { BarChart3, TrendingUp, Award } from 'lucide-react'
import type { BirdDetection, DetectionStats } from '../services/analysis.service'
import { calculateDetectionStats } from '../services/analysis.service'
import './DetectionStats.css'

interface DetectionStatsProps {
  readonly detections: BirdDetection[]
  readonly isLive?: boolean
}

export const DetectionStatsComponent: FC<DetectionStatsProps> = ({
  detections,
  isLive = false,
}) => {
  const stats = useMemo<DetectionStats>(
    () => calculateDetectionStats(detections),
    [detections],
  )

  const topSpecies = useMemo(() => {
    const entries = Array.from(stats.speciesCount.entries())
    return entries
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
  }, [stats])

  return (
    <div className="detection-stats">
      <div className="stats-header">
        <h3 className="stats-title">
          {isLive ? (
            <>
              <span className="live-indicator">●</span>
              Análisis en Vivo
            </>
          ) : (
            'Estadísticas de Detección'
          )}
        </h3>
      </div>

      <div className="stats-grid">
        {/* Total detecciones */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#3b82f6' }}>
            <BarChart3 size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Detecciones</div>
            <div className="stat-value">{stats.totalDetections}</div>
          </div>
        </div>

        {/* Especies únicas */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#8b5cf6' }}>
            <Award size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Especies Únicas</div>
            <div className="stat-value">{stats.speciesCount.size}</div>
          </div>
        </div>

        {/* Confianza promedio */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10b981' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Confianza Promedio</div>
            <div className="stat-value">{stats.averageConfidence.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Top 3 especies */}
      {topSpecies.length > 0 && (
        <div className="top-species">
          <h4 className="top-species-title">Top Especies Detectadas</h4>
          <ul className="species-list">
            {topSpecies.map(([species, count], index) => (
              <li key={species} className="species-item">
                <span className="species-rank">#{index + 1}</span>
                <div className="species-info">
                  <div className="species-name">{species}</div>
                  <div className="species-count">{count} detecciones</div>
                </div>
                <div className="species-badge">{count}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detección con mayor confianza */}
      {stats.highestConfidence && (
        <div className="highest-confidence">
          <div className="confidence-label">Mayor Confianza:</div>
          <div className="confidence-item">
            <img
              src={stats.highestConfidence.foto_base64}
              alt={stats.highestConfidence.especie}
              className="confidence-image"
            />
            <div className="confidence-details">
              <div className="confidence-species">
                {stats.highestConfidence.especie}
              </div>
              <div className="confidence-value">
                {stats.highestConfidence.confianza.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
