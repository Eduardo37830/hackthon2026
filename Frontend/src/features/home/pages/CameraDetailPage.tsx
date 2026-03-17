import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, AlertCircle, Loader2, Activity } from 'lucide-react'

import { labels } from '@/constants/labels'
import { HomeShell } from '@/features/home/components/HomeShell'
import { Button } from '../../../shared/ui/button/Button'
import { Card } from '@/shared/ui/card/Card'
import {
  analysisService,
  type AnalysisResult,
  type BirdDetection,
} from '../services/analysis.service'
import { BirdDetectionCard } from '../components/BirdDetectionCard'
import { DetectionStatsComponent } from '../components/DetectionStats'
import './CameraDetailPage.css'
import './CameraDetailPage.css'

interface CameraDetailPageProps {
  readonly __noProps?: never
}

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected'

export const CameraDetailPage: FC<CameraDetailPageProps> = () => {
  const navigate = useNavigate()
  const { cameraId } = useParams<{ cameraId: string }>()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [streamError, setStreamError] = useState<string>('')
  const [detections, setDetections] = useState<BirdDetection[]>([])
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })
  const [showImageDetail, setShowImageDetail] = useState<BirdDetection | null>(null)
  const [fps, setFps] = useState(4)
  const frameCountRef = useRef(0)
  const fpsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Obtener lista de cámaras disponibles al montar
  useEffect(() => {
    document.title = labels.cameraDetailPageTitle || 'Detalle de Cámara'

    navigator.mediaDevices
      .enumerateDevices()
      .then((deviceInfos) => {
        const videoDevices = deviceInfos.filter((d) => d.kind === 'videoinput')
        setDevices(videoDevices)
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId)
        }
      })
      .catch((err) => {
        console.error('Error enumerando dispositivos:', err)
        setStreamError('No se pudieron obtener las cámaras disponibles.')
      })

    return () => {
      stopStreaming()
    }
  }, [])

  // Listener para cambios de estado del servicio de análisis
  useEffect(() => {
    const unsubscribeStatus = analysisService.onStatusChange((status) => {
      setConnectionStatus(
        status === 'connected'
          ? 'connected'
          : status === 'error'
            ? 'error'
            : 'disconnected',
      )
      if (status === 'error') {
        setStreamError(
          'Error en la conexión con el servidor de análisis. Verifica que Python esté ejecutándose.',
        )
      }
    })

    const unsubscribeMessage = analysisService.onMessage((result: AnalysisResult) => {
      if (result.detecciones && result.detecciones.length > 0) {
        setDetections(result.detecciones)
      } else {
        // Solo limpiamos si no nos envían error explícito de frame, 
        // asumiendo que "alerta: False, detecciones: []" es el caso normal
        if (!result.error) {
          setDetections([])
        }
      }
    })

    return () => {
      unsubscribeStatus()
      unsubscribeMessage()
    }
  }, [])

  const handleVideoMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget
      setVideoDimensions({ width: video.videoWidth, height: video.videoHeight })
    },
    [],
  )

  const captureAndSendFrame = useCallback(() => {
    const frameDelay = 1000 / fps
    const scheduleNext = () => {
      frameIntervalRef.current = setTimeout(captureAndSendFrame, frameDelay)
    }

    if (!videoRef.current || !canvasRef.current) return

    if (analysisService.getStatus() !== 'connected') {
      scheduleNext()
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      scheduleNext()
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (blob && analysisService.getStatus() === 'connected') {
        analysisService.sendFrame(blob)
        frameCountRef.current++
      }
    }, 'image/jpeg', 0.7)

    scheduleNext()
  }, [fps])

  const startStreaming = useCallback(async () => {
    try {
      setStreamError('')
      setConnectionStatus('connecting')

      if (!selectedDeviceId && devices.length === 0) {
        throw new Error('No hay cámaras disponibles')
      }

      // Iniciar stream de video
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDeviceId
            ? { exact: selectedDeviceId }
            : undefined,
        },
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Conectar al servicio de análisis
      analysisService.connect(cameraId || 'unknown', (result: AnalysisResult) => {
        if (result.detecciones && result.detecciones.length > 0) {
          setDetections(result.detecciones)
        } else {
          setDetections([])
        }
      })

      // Esperar a que el video esté listo
      await new Promise<void>((resolve) => {
        const checkVideo = () => {
          if (videoRef.current?.videoWidth && videoRef.current?.videoHeight) {
            setIsStreaming(true)
            captureAndSendFrame()
            resolve()
          } else {
            setTimeout(checkVideo, 100)
          }
        }
        checkVideo()
      })
    } catch (err) {
      console.error('Error iniciando stream:', err)
      const message =
        err instanceof Error ? err.message : 'Error desconocido'
      setStreamError(
        message.includes('Permission')
          ? 'Permiso denegado para acceder a la cámara'
          : message,
      )
      setConnectionStatus('error')
    }
  }, [selectedDeviceId, devices.length, cameraId, captureAndSendFrame])

  const stopStreaming = useCallback(() => {
    // Detener captura de frames
    if (frameIntervalRef.current) {
      clearTimeout(frameIntervalRef.current)
      frameIntervalRef.current = null
    }

    // Detener video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    // Desconectar servicio de análisis
    analysisService.disconnect()

    // Limpiar estado
    setIsStreaming(false)
    setDetections([])
    setConnectionStatus('disconnected')
    frameCountRef.current = 0

    // Limpiar timer de FPS
    if (fpsTimerRef.current) {
      clearInterval(fpsTimerRef.current)
      fpsTimerRef.current = null
    }
  }, [])

  const handleDownloadDetection = useCallback(
    (detection: BirdDetection, index: number) => {
      // Convertir base64 a blob y descargar
      const link = document.createElement('a')
      link.href = detection.foto_base64
      link.download = `bird-detection-${index}-${detection.especie}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    [],
  )

  return (
    <HomeShell activeTab="cameras">
      <div className="camera-detail-page">
        {/* Header */}
        <div className="camera-detail-header">
          <button
            className="camera-detail-back-btn"
            onClick={() => navigate('/cameras')}
            aria-label="Volver"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="camera-detail-title-group">
            <h1 className="camera-detail-title">Vista en Vivo de Cámara</h1>
            <p className="camera-detail-subtitle">
              Cámara ID: <code>{cameraId || 'desconocida'}</code>
            </p>
          </div>
          <div className="camera-detail-status-badge">
            {connectionStatus === 'connecting' && (
              <>
                <Loader2 size={16} className="status-icon-spin" />
                Conectando...
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <Activity size={16} className="status-icon-pulse" />
                En Vivo
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <AlertCircle size={16} />
                Error de Conexión
              </>
            )}
            {(connectionStatus === 'idle' || connectionStatus === 'disconnected') && (
              <>
                <Camera size={16} />
                Desconectado
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {streamError && (
          <Card className="camera-detail-error-card">
            <AlertCircle size={20} />
            <div>
              <strong>Error:</strong> {streamError}
            </div>
          </Card>
        )}

        <div className="camera-detail-content">
          {/* Left side: Video and controls */}
          <div className="camera-detail-video-section">
            {/* Device selector */}
            {devices.length > 0 && !isStreaming && (
              <div className="camera-detail-device-selector">
                <label htmlFor="device-select">Seleccionar cámara:</label>
                <select
                  id="device-select"
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="device-select-input"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Cámara ${device.deviceId.substring(0, 5)}...`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Video player */}
            <div className="camera-detail-video-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={handleVideoMetadata}
                className="camera-detail-video"
              />

              {/* Overlay with detections */}
              {videoDimensions.width > 0 && (
                <>
                  {detections.map((detection, index) => (
                    <BirdDetectionCard
                      key={`${detection.especie}-${index}`}
                      detection={detection}
                      index={index}
                      videoDimensions={videoDimensions}
                      onImageClick={() => setShowImageDetail(detection)}
                    />
                  ))}

                  {/* Live indicator */}
                  {detections.length > 0 && (
                    <div className="camera-detail-live-badge">
                      <span className="live-dot">●</span>
                      {detections.length} ave{detections.length !== 1 ? 's' : ''} detectada
                      {detections.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Canvas oculto para captura */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Controls */}
            <div className="camera-detail-controls">
              {!isStreaming ? (
                <Button
                  variant="primary"
                  onClick={startStreaming}
                  disabled={connectionStatus === 'connecting'}
                  className="control-button"
                >
                  {connectionStatus === 'connecting' ? (
                    <>
                      <span className="button-loading" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Camera size={18} />
                      Iniciar Análisis
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={stopStreaming}
                  className="control-button control-button--danger"
                >
                  <AlertCircle size={18} />
                  Detener Análisis
                </Button>
              )}

              {/* FPS selector */}
              <div className="fps-selector">
                <label htmlFor="fps-input">FPS:</label>
                <input
                  id="fps-input"
                  type="number"
                  min="1"
                  max="30"
                  value={fps}
                  onChange={(e) => setFps(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                  disabled={isStreaming}
                  className="fps-input"
                />
              </div>
            </div>
          </div>

          {/* Right side: Detections list and stats */}
          <div className="camera-detail-sidebar">
            {/* Statistics */}
            <DetectionStatsComponent detections={detections} isLive={isStreaming} />

            {/* Detections list */}
            {detections.length > 0 && (
              <div className="camera-detail-detections-list">
                <h3 className="detections-list-title">Detecciones</h3>
                <div className="detections-scroll">
                  {detections.map((detection, index) => (
                    <div
                      key={`${detection.especie}-${index}-list`}
                      className="detection-list-item"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleDownloadDetection(detection, index)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleDownloadDetection(detection, index)
                      }
                    >
                      <img
                        src={detection.foto_base64}
                        alt={detection.especie}
                        className="detection-list-thumbnail"
                      />
                      <div className="detection-list-info">
                        <div className="detection-list-species">
                          {detection.especie}
                        </div>
                        <div className="detection-list-confidence">
                          {detection.confianza.toFixed(1)}%
                        </div>
                      </div>
                      <div className="detection-list-download">↓</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image detail modal */}
        {showImageDetail && (
          <div
            className="camera-detail-modal-overlay"
            onClick={() => setShowImageDetail(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Escape' && setShowImageDetail(null)}
          >
            <div
              className="camera-detail-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setShowImageDetail(null)}
                aria-label="Cerrar"
              >
                ✕
              </button>
              <img
                src={showImageDetail.foto_base64}
                alt={showImageDetail.especie}
                className="modal-image"
              />
              <div className="modal-info">
                <h3>{showImageDetail.especie}</h3>
                <p>Confianza: {showImageDetail.confianza.toFixed(2)}%</p>
                <p>Score Final: {showImageDetail.score_final.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </HomeShell>
  )
}
