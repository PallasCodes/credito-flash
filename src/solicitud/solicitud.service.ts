import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'

import { createQueryParams } from 'src/utils/createQueryParams'
import { IniciarSolicitudDto } from './dto/requests/iniciar-solicitud.dto'
import { GuardarInfoPersonalDto } from './dto/requests/guardar-info-personal.dto'
import { GuardarDatosIdentificacionDto } from './dto/requests/guardar-datos-identificacion.dto'
import { GuardarInfoLaboralDto } from './dto/requests/guardar-info-laboral.dto'
import { CustomResponse, Message } from 'src/utils/customResponse'
import { GuardarCentroTrabajoDto } from './dto/requests/guardar-centro-trabajo.dto'
import { GuardarDomicilioDto } from './dto/requests/guardar-domicilio.dto'
import { RegistrarContactoDto } from './dto/requests/registrar-contacto.dto'
import { Contacto } from 'src/types/contacto.interface'
import { GuardarInfoContactosDto } from './dto/requests/guardar-info-contactos.dto'
import { GuardarReferenciaDto } from './dto/requests/guardar-referencia.dto'
import { GuardarInfoReferenciasDto } from './dto/requests/guardar-info-referencias.dto'
import { GuardarCuentaDomiciliacionDto } from './dto/requests/guardar-cuenta-domiciliacion.dto'
import { GuardarInfoFinancieraDto } from './dto/requests/guardar-info-financiera.dto'

@Injectable()
export class SolicitudService {
  static readonly BASE_ERROR_MESSAGE =
    'No se puedo guardar la información, inténtelo más tarde o comuniquese con nosotros para apoyarlo'

  constructor(private manager: EntityManager) {}

  async iniciarSolicitud({ solicitudv3 }: IniciarSolicitudDto) {
    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123IniciarProcesoCaptura
        @sessionid = ${new Date().getTime()}, 
        @idproductoscc = ${solicitudv3.idproductoscc}, 
        @idtipoorden = ${solicitudv3.idtipoorden},
        @idpersonafisica = ${solicitudv3.idpersonafisica}, 
        @idvendedor = 18012,
        @idpersonalcaptura = 18012,
        @nuevocliente = ${null}, 
        @resultcode = @resultcode OUTPUT;
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return 'No se puede iniciar el proceso de captura...'
    }
    if (response[0].resultcode <= 0) {
      switch (response[0].resultcode) {
        case -1:
          return 'La clave de producto no es válida'
        case -2:
          return 'El tipo de orden no es válido'
        case -3:
          return 'El cliente no es válido o se encuentra en lista negra'
        case -4:
          return 'El vendedor no es válido'
        default:
          return 'No se puede iniciar el proceso de captura...'
      }
    }

    const response2 = await this.manager.query(
      `EXEC v3.sp_a123getSolicitudV3ById @idsolicitud = ${response[0].resultcode}, @idpersonal = 18012`,
    )

    return response2
  }

  async guardarInfoPersonal({
    datos01infopersonal,
    solicitudv3,
  }: GuardarInfoPersonalDto) {
    const queryParams = createQueryParams(datos01infopersonal, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarInfoPersonal
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return 'No se puedo guardar la información personal, inténtelo más tarde o comuniquese con nosotros para apoyarlo'
    }

    switch (response[0].resultcode) {
      case 1:
        return 'Información personal actualizada correctamente'
      case 2:
        return 'Información personal guardada correctamente'
      case -1:
        return 'La solicitud no es válida o ya no se encuentra disponible para edición'
      case -2:
        return 'No se puede registrar el nuevo cliente'
      case -3:
        return 'No se puede registrar el nuevo cliente porque ya existe uno con el mismo RFC'
      default:
        return 'No se puedo guardar la información personal, inténtelo más tarde o comuniquese con nosotros para apoyarlo'
    }
  }

  async guardarDatosIdentificacion({
    datos02datosidentificacion,
    solicitudv3,
  }: GuardarDatosIdentificacionDto) {
    const queryParams = createQueryParams(datos02datosidentificacion, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarDatosIdentificacion
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return 'No se puedo guardar la información, inténtelo más tarde o comuniquese con nosotros para apoyarlo'
    }

    let mensaje: string
    let error: boolean = response[0].resultcode <= 0

    switch (response[0].resultcode) {
      case 1:
        mensaje = 'Información actualizada correctamente'
        break
      case -1:
        mensaje = 'La solicitud no es válida o ya no se encuentra disponible para edición'
        break
      case -2:
        mensaje = 'No se puede registrar el nuevo cliente'
        break
      default:
        mensaje =
          'No se puedo guardar la información, inténtelo más tarde o comuniquese con nosotros para apoyarlo'
        break
    }

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarInfoLaboral({ datos03infolaboral, solicitudv3 }: GuardarInfoLaboralDto) {
    const queryParams = createQueryParams(datos03infolaboral, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarInfoLaboral
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return 'No se puedo guardar la información, inténtelo más tarde o comuniquese con nosotros para apoyarlo'
    }

    let mensaje: string
    let error: boolean = response[0].resultcode <= 0

    switch (response[0].resultcode) {
      case 1:
        mensaje = 'Información actualizada correctamente'
        break
      case 2:
        mensaje = 'Información guardada correctamente'
        break
      case -1:
        mensaje = 'La solicitud no es válida o ya no se encuentra disponible para edición'
      case -2:
        mensaje =
          'La clave del sindicato no es válida o no corresponde con la entidad seleccionada'
        break
      case -3:
        mensaje =
          'El número de personal es obligatorio para el tipo de entidad seleccionada'
        break
      case -4:
        mensaje = 'No se puede registrar el nuevo cliente'
        break
      case -5:
        mensaje =
          'Ya existe un cliente registrado para la misma persona física y la misma entidad/convenio'
        break
      default:
        mensaje =
          'No se puedo guardar la información, inténtelo más tarde o comuniquese con nosotros para apoyarlo'
        break
    }

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarCentroTrabajo({
    solicitudv3,
    datos04centrotrabajo,
  }: GuardarCentroTrabajoDto) {
    const queryParams = createQueryParams(datos04centrotrabajo, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarCentroTrabajo
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Centro de trabajo actualizado correctamente',
      '2': 'Centro de trabajo guardado correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarDomicilio({ datos05domicilio, solicitudv3 }: GuardarDomicilioDto) {
    const queryParams = createQueryParams(datos05domicilio, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarDomicilio
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Domicilio actualizado correctamente',
      '2': 'Domicilio guardado correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
      '-2': 'Ya existe un domicilio registrado para este cliente con la misma dirección',
      '-3': 'No se puede procesar la petición, error no identificado',
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
  }

  async registrarContacto({ solicitudv3, contacto }: RegistrarContactoDto) {
    const queryParams = createQueryParams(contacto, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123RegistrarPersonaFisicaContacto
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Contacto registrado correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
      '-2': 'No se puede registrar el contacto ya que se encuentra en la lista negra de contactos',
      '-3': 'No registrado, el contacto ya se encuentra registrado para el mismo cliente',
    }

    const mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    const error = response[0].resultcode <= 0

    if (response[0].resultcode === 1) {
      const response2: Contacto[] = await this.manager.query(
        `EXEC v3.sp_a123BuscarContactos @idsolicitud = ${solicitudv3.idsolicitud}`,
      )

      const contactos = {
        listaEmailsLaborales: [],
        listaEmailsPersonales: [],
        listaTelefonosCasa: [],
        listaTelefonosCelular: [],
        listaTelefonosRecados: [],
      }

      response2.forEach((con) => {
        switch (con.idtipo) {
          case 1301:
            contactos.listaTelefonosCasa.push(con)
            break
          case 1302:
            contactos.listaTelefonosCelular.push(con)
            break
          case 1303:
            contactos.listaTelefonosRecados.push(con)
            break
          case 1305:
            contactos.listaEmailsPersonales.push(con)
            break
          case 1306:
            contactos.listaEmailsLaborales.push(con)
            break
        }
      })

      return new CustomResponse(new Message(mensaje, error), contactos)
    }

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarInfoContactos({
    solicitudv3,
    datos06infocontactos,
  }: GuardarInfoContactosDto) {
    const queryParams = createQueryParams(datos06infocontactos, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarInfoContactos
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Información de contactos actualizada correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarReferencia({ solicitudv3, referencia }: GuardarReferenciaDto) {
    const queryParams = createQueryParams(referencia, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarPersonaFisicaReferencia
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Referencia actualizada correctamente',
      '2': 'Referencia guardada correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
      '-2': 'No registrada, la referencia ya se encuentra registrada para el mismo cliente',
    }

    const mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    const error = response[0].resultcode <= 0

    if (response[0].resultcode === 1 || response[0].resultcode === 2) {
      const referencias = await this.manager.query(
        `EXEC v3.sp_a123BuscarReferencias 
          @mode = 0, 
          @idsolicitud = ${solicitudv3.idsolicitud}, 
          @idreferencia = ${null}`,
      )

      return new CustomResponse(new Message(mensaje, error), referencias)
    }

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarInfoReferencias({
    solicitudv3,
    datos07inforeferencias,
  }: GuardarInfoReferenciasDto) {
    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarInfoReferencias
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        @referencia1 = ${datos07inforeferencias.idreferencia1},
        @referencia2 = ${datos07inforeferencias.idreferencia2},
        @resultcode = @resultcode OUTPUT;
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Referencias actualizadas correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarCuentaDomiciliacion({
    solicitudv3,
    datos08cuenta01,
  }: GuardarCuentaDomiciliacionDto) {
    const queryParams = createQueryParams(datos08cuenta01, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarCuentaDomiciliacion
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Cuenta de domiciliación actualizada correctamente',
      '2': 'Cuenta de domiciliación guardada correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
      '-2': 'No se puede guardar la nueva cuenta de domiciliación',
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarInfoFinanciera({
    datos10infofinanciera,
    solicitudv3,
  }: GuardarInfoFinancieraDto) {
    const queryParams = createQueryParams(datos10infofinanciera, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarInfoFinanciera
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = 18017,
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Información financiera guardada correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
  }
}
