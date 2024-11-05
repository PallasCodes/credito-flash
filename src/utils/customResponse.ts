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
  mensaje: Message;
  [key: string]: any // Index signature

  constructor(mensaje: Message, additionalFields?: { [key: string]: any }) {
    this.mensaje = mensaje

    if (additionalFields) {
      Object.keys(additionalFields).forEach((key) => {
        this[key] = additionalFields[key]
      })
    }
  }
}
