import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Response } from 'express'

import { CustomResponse, Message, TipoMensajeRespuesta } from './customResponse'

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const mensajeError =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Error interno del servidor'

    const customResponse = new CustomResponse(
      new Message(mensajeError, true, TipoMensajeRespuesta.DIALOG),
    )

    response.status(status).json(customResponse)
  }
}
