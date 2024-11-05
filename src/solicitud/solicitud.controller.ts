import { Body, Controller, Post } from '@nestjs/common'

import { SolicitudService } from './solicitud.service'
import { IniciarSolicitudDto } from './dto/requests/iniciar-solicitud.dto'
import { GuardarInfoPersonalDto } from './dto/requests/guardar-info-personal.dto'
import { GuardarDatosIdentificacionDto } from './dto/requests/guardar-datos-identificacion.dto'
import { GuardarInfoLaboralDto } from './dto/requests/guardar-info-laboral.dto'
import { GuardarCentroTrabajoDto } from './dto/requests/guardar-centro-trabajo.dto'
import { GuardarDomicilioDto } from './dto/requests/guardar-domicilio.dto'
import { RegistrarContactoDto } from './dto/requests/registrar-contacto.dto'
import { GuardarInfoContactosDto } from './dto/requests/guardar-info-contactos.dto'
import { GuardarReferenciaDto } from './dto/requests/guardar-referencia.dto'
import { GuardarInfoReferenciasDto } from './dto/requests/guardar-info-referencias.dto'
import { GuardarCuentaDomiciliacionDto } from './dto/requests/guardar-cuenta-domiciliacion.dto'
import { GuardarInfoFinancieraDto } from './dto/requests/guardar-info-financiera.dto'

@Controller('solicitud')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @Post('iniciar-solicitud')
  iniciarSolicitud(@Body() iniciarSolicitudDto: IniciarSolicitudDto) {
    return this.solicitudService.iniciarSolicitud(iniciarSolicitudDto)
  }

  @Post('guardar-info-personal')
  guardarInfoPersonal(@Body() guardarInfoPersonalDto: GuardarInfoPersonalDto) {
    return this.solicitudService.guardarInfoPersonal(guardarInfoPersonalDto)
  }

  @Post('guardar-datos-identificacion')
  guardarDatosIdentificacion(
    @Body() guardarDatosIdentificacionDto: GuardarDatosIdentificacionDto,
  ) {
    return this.solicitudService.guardarDatosIdentificacion(guardarDatosIdentificacionDto)
  }

  @Post('guardar-info-laboral')
  guardarInfoLaboral(@Body() guardarInfoLaboralDto: GuardarInfoLaboralDto) {
    return this.solicitudService.guardarInfoLaboral(guardarInfoLaboralDto)
  }

  @Post('guardar-centro-trabajo')
  guardarCentroTrabajo(@Body() guardarCentroTrabajoDto: GuardarCentroTrabajoDto) {
    return this.solicitudService.guardarCentroTrabajo(guardarCentroTrabajoDto)
  }

  @Post('guardar-domicilio')
  guardarDomicilio(@Body() guardarDomicilioDto: GuardarDomicilioDto) {
    return this.solicitudService.guardarDomicilio(guardarDomicilioDto)
  }

  @Post('registrar-contacto')
  registrarContacto(@Body() registrarContactoDto: RegistrarContactoDto) {
    return this.solicitudService.registrarContacto(registrarContactoDto)
  }

  @Post('guardar-info-contactos')
  guardarInfoContactos(@Body() guardarInfoContactosDto: GuardarInfoContactosDto) {
    return this.solicitudService.guardarInfoContactos(guardarInfoContactosDto)
  }

  @Post('guardar-referencia')
  guardarReferencia(@Body() guardarReferenciaDto: GuardarReferenciaDto) {
    return this.solicitudService.guardarReferencia(guardarReferenciaDto)
  }

  @Post('guardar-info-referencias')
  guardarReferencias(@Body() guardarInfoReferenciasDto: GuardarInfoReferenciasDto) {
    return this.solicitudService.guardarInfoReferencias(guardarInfoReferenciasDto)
  }

  @Post('guardar-cuenta-domiciliacion')
  guardarCuentaDomiciliacion(
    @Body() guardarCuentaDomiciliacionDto: GuardarCuentaDomiciliacionDto,
  ) {
    return this.solicitudService.guardarCuentaDomiciliacion(guardarCuentaDomiciliacionDto)
  }

  @Post('guardar-info-financiera')
  guardarInfoFinanciera(@Body() guardarInfofinancieraDto: GuardarInfoFinancieraDto) {
    return this.solicitudService.guardarInfoFinanciera(guardarInfofinancieraDto)
  }
}
