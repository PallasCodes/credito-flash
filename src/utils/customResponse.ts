enum TipoMensajeRespuesta {
  NONE = 'NONE',
  DIALOG = 'DIALOG',
  TOAST = 'TOAST',
}

export class Message {
  mensaje?: string
  error?: boolean
  mostrar?: TipoMensajeRespuesta

  constructor(
    mensaje: string = 'ok',
    error: boolean = false,
    mostrar: TipoMensajeRespuesta = TipoMensajeRespuesta.TOAST,
  ) {
    this.error = error
    this.mostrar = mostrar
    this.mensaje = mensaje
  }
}

export class CustomResponse {
  mensaje: Message
  data?: any

  constructor(mensaje: Message, data?: any) {
    this.mensaje = mensaje
    this.data = data
  }
}
