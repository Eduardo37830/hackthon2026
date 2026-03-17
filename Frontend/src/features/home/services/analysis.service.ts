/**
 * Servicio para manejar análisis de video con modelos ML de Python
 * Incluye detección de aves usando YOLO y clasificación con ResNet18
 */

export interface BirdDetection {
  especie: string
  confianza: number
  confianza_detector: number
  score_final: number
  coordenadas: [number, number, number, number] // [x1, y1, x2, y2]
  foto_base64: string
  detalles: Record<string, unknown>[]
}

export interface AnalysisResult {
  alerta?: boolean
  detecciones?: BirdDetection[]
  error?: string
}

export interface DetectionStats {
  totalDetections: number
  speciesCount: Map<string, number>
  averageConfidence: number
  highestConfidence: BirdDetection | null
  lastDetectionTime: Date | null
}

export type WebSocketMessageHandler = (data: AnalysisResult) => void
export type WebSocketErrorHandler = (error: Event) => void
export type WebSocketStatusHandler = (status: 'connected' | 'disconnected' | 'error') => void

export class AnalysisService {
  private ws: WebSocket | null = null
  private messageHandlers: Set<WebSocketMessageHandler> = new Set()
  private errorHandlers: Set<WebSocketErrorHandler> = new Set()
  private statusHandlers: Set<WebSocketStatusHandler> = new Set()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null

  /**
   * Conecta al WebSocket del servidor de análisis de Python
   */
  connect(cameraId: string, onMessage: WebSocketMessageHandler): void {
    this.messageHandlers.add(onMessage)

    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = import.meta.env.VITE_PYTHON_SERVICE_URL || 'localhost:8000'
      const wsUrl = `${protocol}//${host}/ws/video_stream?id_dispositivo=${cameraId}&camera_id=${cameraId}`

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('🔗 Conectado a servicio de análisis de Python')
        this.reconnectAttempts = 0
        this.notifyStatus('connected')
        this.setupHeartbeat()
      }

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data: AnalysisResult = JSON.parse(event.data)
          this.messageHandlers.forEach((handler) => handler(data))
        } catch (error) {
          console.error('Error parseando mensaje WebSocket:', error)
        }
      }

      this.ws.onerror = (error: Event) => {
        console.error('❌ Error en WebSocket:', error)
        this.notifyStatus('error')
        this.errorHandlers.forEach((handler) => handler(error))
      }

      this.ws.onclose = () => {
        console.log('🔌 Desconectado del servicio de análisis')
        this.clearHeartbeat()
        this.notifyStatus('disconnected')
        this.attemptReconnect(cameraId)
      }
    } catch (error) {
      console.error('Error conectando a WebSocket:', error)
      this.notifyStatus('error')
    }
  }

  /**
   * Envía un frame de video para análisis
   */
  sendFrame(blob: Blob): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(blob)
      return true
    }
    return false
  }

  /**
   * Se desconecta del WebSocket
   */
  disconnect(): void {
    this.clearHeartbeat()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers.clear()
    this.errorHandlers.clear()
    this.statusHandlers.clear()
  }

  /**
   * Registra un handler para mensajes
   */
  onMessage(handler: WebSocketMessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  /**
   * Registra un handler para errores
   */
  onError(handler: WebSocketErrorHandler): () => void {
    this.errorHandlers.add(handler)
    return () => this.errorHandlers.delete(handler)
  }

  /**
   * Registra un handler para cambios de estado
   */
  onStatusChange(handler: WebSocketStatusHandler): () => void {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }

  /**
   * Obtiene el estado actual de la conexión
   */
  getStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (this.ws?.readyState === WebSocket.OPEN) return 'connected'
    if (this.ws?.readyState === WebSocket.CONNECTING) return 'connecting'
    return 'disconnected'
  }

  /**
   * Intenta reconectarse automáticamente
   */
  private attemptReconnect(cameraId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(
        `🔄 Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      )
      setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          this.connect(cameraId, () => {})
        }
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  /**
   * Configura un heartbeat para mantener la conexión viva
   */
  private setupHeartbeat(): void {
    this.clearHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Enviar un ping (generalmente el servidor responde con pong)
        // Si es necesario, ajustar según el protocolo del servidor
      }
    }, 30000) // Cada 30 segundos
  }

  /**
   * Limpia el intervalo de heartbeat
   */
  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * Notifica a los listeners del cambio de estado
   */
  private notifyStatus(status: 'connected' | 'disconnected' | 'error'): void {
    this.statusHandlers.forEach((handler) => handler(status))
  }
}

/**
 * Calcula estadísticas de detecciones
 */
export function calculateDetectionStats(detections: BirdDetection[]): DetectionStats {
  const speciesCount = new Map<string, number>()
  let totalConfidence = 0

  detections.forEach((detection) => {
    speciesCount.set(detection.especie, (speciesCount.get(detection.especie) ?? 0) + 1)
    totalConfidence += detection.confianza
  })

  const highestConfidence =
    detections.length > 0
      ? detections.reduce((max, det) => (det.confianza > max.confianza ? det : max))
      : null

  return {
    totalDetections: detections.length,
    speciesCount,
    averageConfidence: detections.length > 0 ? totalConfidence / detections.length : 0,
    highestConfidence,
    lastDetectionTime: detections.length > 0 ? new Date() : null,
  }
}

/**
 * Obtiene un nombre científico amigable
 */
export function getSpeciesDisplayName(scientificName: string): string {
  // Extracto del nombre científico mostrando género + especie
  const parts = scientificName.split(' ')
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`
  }
  return scientificName
}

/**
 * Convierte confianza (0-100) a un color visual
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'rgb(34, 197, 94)' // green-500
  if (confidence >= 60) return 'rgb(59, 130, 246)' // blue-500
  if (confidence >= 40) return 'rgb(251, 146, 60)' // orange-500
  return 'rgb(239, 68, 68)' // red-500
}

// Instancia global del servicio (singleton)
export const analysisService = new AnalysisService()
