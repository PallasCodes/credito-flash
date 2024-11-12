import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { SolicitudesFlashService } from './solicitudes-flash.service'
import { ValidarCodigoCelularDto } from './dto/validar-codigo-celular'
import { RegistrarContraseniaDto } from './dto/registrar-contrasenia.dto'
import { RegistrarSolicitudFlashDto } from './dto/registrar-solicitud-flash.dto'

@Controller('solicitud-flash')
export class SolicitudesFlashController {
  constructor(private readonly solicitudesFlashService: SolicitudesFlashService) {}

  @Post('registrar-solicitud-flash')
  registrarSolicitudFlash(
    @Body() registrarSolicitudFlashDto: RegistrarSolicitudFlashDto,
  ) {
    return this.solicitudesFlashService.registrarSolicitudFlash(
      registrarSolicitudFlashDto,
    )
  }

  @Post('registrar-contrasena')
  registrarContrasenia(@Body() registrarContraseniaDto: RegistrarContraseniaDto) {
    return this.solicitudesFlashService.registrarContrasenia(registrarContraseniaDto)
  }

  @Post('validar-codigo-celular')
  validarCodigoCelular(@Body() validarCodigoCelularDto: ValidarCodigoCelularDto) {
    return this.solicitudesFlashService.validarCodigoCelular(validarCodigoCelularDto)
  }

  @Get('buscar-rfc/:rfc')
  buscarRfc(@Param('rfc') rfc: string) {
    return this.solicitudesFlashService.buscarRfc(rfc)
  }
}
