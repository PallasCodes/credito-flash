export interface Contacto {
  idcontacto: number
  idpersonafisica: number
  idtipo: number
  tiempocreacion: Date
  idformato: number
  contacto: string
  tiempoactualizacion?: number | null
  evitarmarketing: boolean
  idestatusvalidacion: number
  idpersonalregistro: number
  idpersonalvalidacion?: number | null
  tiempovalidacion?: number | null
  horariodespuesde: string
  horarioantesde: string
  horariodias: string
}
