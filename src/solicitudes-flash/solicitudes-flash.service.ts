import { BadRequestException, Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { ValidarCodigoCelularDto } from './dto/validar-codigo-celular'
import { createQueryParams } from 'src/utils/createQueryParams'
import { CustomResponse, Message } from 'src/utils/customResponse'
import { SolicitudService } from 'src/solicitud/solicitud.service'
import { RegistrarContraseniaDto } from './dto/registrar-contrasenia.dto'
import { RegistrarSolicitudFlashDto } from './dto/registrar-solicitud-flash.dto'
import { User } from 'src/auth/entities/user.entity'

@Injectable()
export class SolicitudesFlashService {
  constructor(private manager: EntityManager) {}

  async registrarSolicitudFlash(dto: RegistrarSolicitudFlashDto, user?: User) {
    if (user) {
      dto.idUsuarioCreditoFlash = user.id
    } else {
      delete dto.idUsuarioCreditoFlash
    }

    const queryParams = createQueryParams(dto, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC web.sp_flash_registrarSolicitudCreditoFlash
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode || response[0].resultcode !== 1) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    return new CustomResponse(new Message())
  }

  async registrarContrasenia(dto: RegistrarContraseniaDto) {
    dto.password = bcrypt.hashSync(dto.password, 10)
    const queryParams = createQueryParams(dto, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC web.sp_flash_registrarContrasena
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode || response[0].resultcode !== 1) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    return new CustomResponse(new Message())
  }

  async validarCodigoCelular(dto: ValidarCodigoCelularDto) {
    const result = await this.manager.query(`
      EXEC web.sp_flash_obtenerCodigoValidacionProspecto
        @rfc = ${dto.rfc};
      `)

    if (!result || !result.length || !result[0].codigo) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    if (result[0].codigo !== dto.codigo) {
      return new CustomResponse(new Message('El código ingresado no coincide', true))
    }

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC web.sp_flash_validarCelular
        @rfc = ${dto.rfc},
        @resultcode = @resultcode OUTPUT;
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode || response[0].resultcode !== 1) {
      // TODO: eliminar código depués de validarlo
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    return new CustomResponse(new Message('Tu número celular ha sido validado'))
  }

  async buscarRfc(rfc: string) {
    if (!rfc || rfc.trim() == '') {
      return new BadRequestException('EL RFC es requerido')
    }

    const response = await this.manager.query(`
      EXEC web.sp_buscarRFC
        @rfc = ${rfc.toUpperCase()};
      `)

    return new CustomResponse(new Message(), {
      idPersonaFisica: response[0]?.idPersonaFisica || null,
    })
  }
}
