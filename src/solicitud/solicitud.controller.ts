import { Body, Controller, Post, UseGuards } from '@nestjs/common'

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
import { BaseRequestDto } from './dto/requests/base-request.dto'
import { SeleccionarPromocionDto } from './dto/requests/seleccionar-promocion.dto'
import { ActualizarTrainProcessDto } from './dto/requests/actualizar-train-process.dto'
import { GuardarCondicionesOrdenDto } from './dto/requests/guardar-condiciones-orden.to'
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwt.guard'
import { Auth, GetUser } from 'src/auth/decorators'
import { User } from 'src/auth/entities/user.entity'
import { ValidarClabeTokuDto } from './dto/validar-clabe-toku.dto'
import { GuardarDocTokuDto } from './dto/guardar-doc-toku.dto'

@UseGuards(OptionalJwtAuthGuard)
@Controller('solicitud')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @Post('iniciar-solicitud')
  iniciarSolicitud(
    @Body() iniciarSolicitudDto: IniciarSolicitudDto,
    @GetUser() user: User,
  ) {
    return this.solicitudService.iniciarSolicitud(iniciarSolicitudDto, user)
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

  @Auth()
  @Post('guardar-cuenta-domiciliacion')
  guardarCuentaDomiciliacion(
    @Body() guardarCuentaDomiciliacionDto: GuardarCuentaDomiciliacionDto,
    @GetUser() user: User,
  ) {
    return this.solicitudService.guardarCuentaDomiciliacion(
      guardarCuentaDomiciliacionDto,
      user,
    )
  }

  @Auth()
  @Post('guardar-info-financiera')
  guardarInfoFinanciera(@Body() guardarInfofinancieraDto: GuardarInfoFinancieraDto) {
    return this.solicitudService.guardarInfoFinanciera(guardarInfofinancieraDto)
  }

  @Post('obtener-promociones-disponibles')
  obtenerPromocionesDisponibles(@Body() solicitudV3IdDto: BaseRequestDto) {
    return this.solicitudService.obtenerPromocionesDisponibles(solicitudV3IdDto)
  }

  @Post('seleccionar-promocion')
  seleccionarPromocion(@Body() seleccionarPromocionDto: SeleccionarPromocionDto) {
    return this.solicitudService.seleccionarPromocion(seleccionarPromocionDto)
  }

  @Post('actualizar-train-process')
  actualizarTrainProcess(@Body() actualizarTrainProcessDto: ActualizarTrainProcessDto) {
    return this.solicitudService.actualizarTrainProcess(actualizarTrainProcessDto)
  }

  @Post('guardar-condiciones-orden')
  guardarCondicionesOrden(
    @Body() guardarCondicionesOrdenDto: GuardarCondicionesOrdenDto,
  ) {
    return this.solicitudService.guardarCondicionesOrden(guardarCondicionesOrdenDto)
  }

  @Post('validar-clabe-toku')
  validarClabeToku(@Body() clabeTokuDto: ValidarClabeTokuDto) {
    console.log('toku')
    return this.solicitudService.validarClabeToku(clabeTokuDto)
  }

  @Post('guardar-doc-toku')
  guardarDocToku(@Body() guardarDocTokuDto: GuardarDocTokuDto) {
    return this.solicitudService.crearDocComprobantePago(guardarDocTokuDto)
  }
}
