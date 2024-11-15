import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'

import { SolicitudesFlashService } from './solicitudes-flash.service'
import { ValidarCodigoCelularDto } from './dto/validar-codigo-celular'
import { RegistrarContraseniaDto } from './dto/registrar-contrasenia.dto'
import { RegistrarSolicitudFlashDto } from './dto/registrar-solicitud-flash.dto'
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwt.guard'
import { GetUser } from 'src/auth/decorators'
import { User } from 'src/auth/entities/user.entity'

@Controller('solicitud-flash')
export class SolicitudesFlashController {
  constructor(private readonly solicitudesFlashService: SolicitudesFlashService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('registrar-solicitud-flash')
  registrarSolicitudFlash(
    @Body() registrarSolicitudFlashDto: RegistrarSolicitudFlashDto,
    @GetUser() user: User,
  ) {
    return this.solicitudesFlashService.registrarSolicitudFlash(
      registrarSolicitudFlashDto,
      user,
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
