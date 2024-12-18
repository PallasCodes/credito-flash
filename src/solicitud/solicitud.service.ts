import { ConfigService } from '@nestjs/config'
import { BadRequestException, Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import axios from 'axios'

import { User } from 'src/auth/entities/user.entity'
import { Contacto } from 'src/types/contacto.interface'
import { createQueryParams } from 'src/utils/createQueryParams'
import { CustomResponse, Message } from 'src/utils/customResponse'
import { ActualizarTrainProcessDto } from './dto/requests/actualizar-train-process.dto'
import { BaseRequestDto } from './dto/requests/base-request.dto'
import { GuardarCentroTrabajoDto } from './dto/requests/guardar-centro-trabajo.dto'
import { GuardarCondicionesOrdenDto } from './dto/requests/guardar-condiciones-orden.to'
import { GuardarCuentaDomiciliacionDto } from './dto/requests/guardar-cuenta-domiciliacion.dto'
import { GuardarDatosIdentificacionDto } from './dto/requests/guardar-datos-identificacion.dto'
import { GuardarDomicilioDto } from './dto/requests/guardar-domicilio.dto'
import { GuardarInfoContactosDto } from './dto/requests/guardar-info-contactos.dto'
import { GuardarInfoFinancieraDto } from './dto/requests/guardar-info-financiera.dto'
import { GuardarInfoLaboralDto } from './dto/requests/guardar-info-laboral.dto'
import { GuardarInfoPersonalDto } from './dto/requests/guardar-info-personal.dto'
import { GuardarInfoReferenciasDto } from './dto/requests/guardar-info-referencias.dto'
import { GuardarReferenciaDto } from './dto/requests/guardar-referencia.dto'
import { IniciarSolicitudDto } from './dto/requests/iniciar-solicitud.dto'
import { RegistrarContactoDto } from './dto/requests/registrar-contacto.dto'
import { SeleccionarPromocionDto } from './dto/requests/seleccionar-promocion.dto'

@Injectable()
export class SolicitudService {
  ID_PERSONAL = this.configService.get<number>('ID_PERSONAL')
  ID_VENDEDOR = this.configService.get<number>('ID_VENDEDOR')
  ID_PRODUCTO = this.configService.get<number>('ID_PRODUCTO')

  static readonly BASE_ERROR_MESSAGE =
    'No se puede guardar la información, inténtelo más tarde o comuniquese con nosotros para apoyarlo'

  constructor(private manager: EntityManager, private configService: ConfigService) {}

  async iniciarSolicitud({ solicitudv3, identidad }: IniciarSolicitudDto, user?: User) {
    if (user) {
      solicitudv3.idpersonafisica = user?.personaFisica?.id
    }

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123IniciarProcesoCaptura
        @sessionid = ${new Date().getTime()}, 
        @idproductoscc = ${solicitudv3.idproductoscc}, 
        @idtipoorden = ${solicitudv3.idtipoorden},
        @idpersonafisica = ${solicitudv3.idpersonafisica}, 
        @idvendedor = ${this.ID_VENDEDOR},
        @idpersonalcaptura = ${this.ID_PERSONAL},
        @nuevocliente = ${null}, 
        @resultcode = @resultcode OUTPUT;
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
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

    const [solicitudcredito] = await this.manager.query(
      `EXEC v3.sp_a123getSolicitudV3ById @idsolicitud = ${response[0].resultcode}, @idpersonal = ${this.ID_PERSONAL}`,
    )

    if (user && identidad) {
      const clientes = await this.manager.query(`
        EXEC web.flash_getConveniosByIdsolicitud
          @idsolicitud = ${solicitudcredito.idSolicitud}, 
          @identidad = ${identidad};
        `)

      if (clientes.length > 0) {
        const params = createQueryParams(
          {
            ...clientes[0],
            // TODO: quitar hardcodeo
            fechacontratacion: '2024-10-10',
          },
          true,
        )

        await this.manager.query(`
          DECLARE @resultcode INT;
          EXEC v3.sp_a123GuardarInfoLaboral
            @idsolicitud = ${solicitudcredito.idSolicitud},
            @idpersonal = ${this.ID_PERSONAL},
            ${params};
          SELECT @resultcode AS resultcode;
          `)

        return new CustomResponse(new Message(), {
          solicitudcredito,
          convenioRegistrado: true,
        })
      }
    }

    return new CustomResponse(new Message(), { solicitudcredito })
  }

  async guardarInfoPersonal(
    { datos01infopersonal, solicitudv3 }: GuardarInfoPersonalDto,
    user?: User,
  ) {
    // TODO: validar que el idpersonafisica de la solicitud sea igual al que viene en el JWT

    const queryParams = createQueryParams(datos01infopersonal, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarInfoPersonal
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = ${this.ID_PERSONAL},
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Información personal actualizada correctamente',
      '2': 'Información personal guardada correctamente',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
      '-2': 'No se puede registrar el nuevo cliente',
      '-3': 'No se puede registrar el nuevo cliente porque ya existe uno con el mismo RFC',
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
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
        @idpersonal = ${this.ID_PERSONAL},
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
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

    await this.actualizarTrainProcessFlash(4, solicitudv3.idsolicitud)

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarInfoLaboral({ datos03infolaboral, solicitudv3 }: GuardarInfoLaboralDto) {
    const queryParams = createQueryParams(datos03infolaboral, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarInfoLaboral
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = ${this.ID_PERSONAL},
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

    await this.actualizarTrainProcessFlash(5, solicitudv3.idsolicitud)

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
        @idpersonal = ${this.ID_PERSONAL},
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

    await this.actualizarTrainProcessFlash(5, solicitudv3.idsolicitud)

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarDomicilio({ datos05domicilio, solicitudv3 }: GuardarDomicilioDto) {
    const queryParams = createQueryParams(datos05domicilio, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarDomicilio
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = ${this.ID_PERSONAL},
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

    await this.actualizarTrainProcessFlash(6, solicitudv3.idsolicitud)

    return new CustomResponse(new Message(mensaje, error))
  }

  async registrarContacto({ solicitudv3, contacto }: RegistrarContactoDto) {
    const queryParams = createQueryParams(contacto, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123RegistrarPersonaFisicaContacto
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = ${this.ID_PERSONAL},
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

      return new CustomResponse(new Message(mensaje, error), { contactos })
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
        @idpersonal = ${this.ID_PERSONAL},
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
        @idpersonal = ${this.ID_PERSONAL},
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

      return new CustomResponse(new Message(mensaje, error), { referencias })
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
        @idpersonal = ${this.ID_PERSONAL},
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

    await this.actualizarTrainProcessFlash(7, solicitudv3.idsolicitud)

    return new CustomResponse(new Message(mensaje, error))
  }

  async guardarCuentaDomiciliacion(
    { solicitudv3, datos08cuenta01 }: GuardarCuentaDomiciliacionDto,
    user: User,
  ) {
    try {
      const headers = {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-key': 'GKW_lG9X3Imbhu_FnecgFCPOB5gdAju-22mnejWct5c',
      }
      const body = {
        account_number: datos08cuenta01.clabe,
        customer_identifier: user.rfc,
      }

      const response = await axios.post(
        'https://api.trytoku.com/bank-account-verification',
        body,
        { headers },
      )

      if (!response.data) {
        throw new BadRequestException(
          'Ocurrió un error al validar tu cuenta, inténtalo más tarde',
        )
      }
      if (response.data.error === 'Invalid CLABE') {
        throw new BadRequestException('La cuenta CLABE no es válida')
      }
      if (response.data.error || response.data.message !== 'OK') {
        throw new BadRequestException('La cuenta CLABE o el RFC no son válidos')
      }
    } catch (error) {
      if (error.response.data.error === 'Invalid CLABE') {
        throw new BadRequestException('La cuenta CLABE no es válida')
      }
      throw new BadRequestException(
        'Ocurrió un error al validar tu cuenta, inténtalo más tarde',
      )
    }

    const queryParams = createQueryParams(datos08cuenta01, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarCuentaDomiciliacion
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = ${this.ID_PERSONAL},
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

    await this.actualizarTrainProcessFlash(8, solicitudv3.idsolicitud)

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
        @idpersonal = ${this.ID_PERSONAL},
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

    await this.actualizarTrainProcessFlash(9, solicitudv3.idsolicitud)

    return new CustomResponse(new Message(mensaje, error))
  }

  async obtenerPromocionesDisponibles({ solicitudv3 }: BaseRequestDto) {
    const promociones = await this.manager.query(`
      EXEC v3.sp_a123BuscarPromocionesDisponibles
        @idsolicitud = ${solicitudv3.idsolicitud}
      `)

    if (!promociones || !promociones.length) {
      return new CustomResponse(
        new Message(
          'No hay promociones disponibles para las condiciones seleccionadas',
          true,
        ),
      )
    }

    return new CustomResponse(new Message(), { promociones })
  }

  async seleccionarPromocion({ promocion, solicitudv3 }: SeleccionarPromocionDto) {
    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123SeleccionarPromocion
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpromocion = ${promocion.idpromocion},
        @resultcode = @resultcode OUTPUT;
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const catMessages = {
      '1': 'Ok',
      '-1': 'La solicitud no es válida o ya no se encuentra disponible para edición',
      '-2': 'La clave de promoción enviada no es válida',
    }

    if (response[0].resultcode === 1) {
      await this.manager.query(`
        DECLARE @resultcode INT;
        EXEC v3.sp_a123CalcularImportesSolicitud
          @idsolicitud = ${solicitudv3.idsolicitud},
          @resultcode = @resultcode OUTPUT;
        SELECT @resultcode AS resultcode;
        `)

      const [solicitudcredito] = await this.manager.query(`
        EXEC v3.sp_a123getSolicitudV3ById
          @idsolicitud = ${solicitudv3.idsolicitud},
          @idpersonal = ${this.ID_PERSONAL};
        `)

      const [datos] = await this.manager.query(`
        EXEC v3.sp_a123getDatosSolicitudV3ById
          @idsolicitud = ${solicitudv3.idsolicitud},
          @trainprocess = 11;
        `)

      return new CustomResponse(new Message('Ok'), {
        solicitudcredito: { ...solicitudcredito, datos },
      })
    }

    let mensaje =
      catMessages[`${response[0].resultcode}`] || SolicitudService.BASE_ERROR_MESSAGE
    let error = response[0].resultcode <= 0

    return new CustomResponse(new Message(mensaje, error))
  }

  async actualizarTrainProcess(actualizarTrainProcessDto: ActualizarTrainProcessDto) {
    const queryParams = createQueryParams(actualizarTrainProcessDto, true)

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC web.sp_flash_actualizarTrainProcess
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode || response[0].resultcode !== 1) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    return new CustomResponse(new Message())
  }

  async guardarCondicionesOrden({
    solicitudv3,
    datos11condiciones,
  }: GuardarCondicionesOrdenDto) {
    const [solicitudcredito] = await this.manager.query(
      `EXEC v3.sp_a123getSolicitudV3ById @idsolicitud = ${solicitudv3.idsolicitud}, @idpersonal = ${this.ID_PERSONAL}`,
    )

    const { importesolicitado, idpromocion, deudaexterna, ...condiciones } =
      datos11condiciones

    const queryParams = createQueryParams(
      {
        ...condiciones,
        periodosiniciomanuales: solicitudcredito.periodosiniciomanuales,
      },
      true,
    )

    const responseProducto = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123EditarProducto
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idproducto = ${this.ID_PRODUCTO},
        @cantidad = 1,
        @precio = ${datos11condiciones.importesolicitado},
        @resultcode = @resultcode OUTPUT;
      SELECT @resultcode AS resultcode;
      `)

    if (
      !responseProducto.length ||
      !responseProducto[0].resultcode ||
      responseProducto[0].resultcode !== 1
    ) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const responseCalc = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123CalcularImportesSolicitud
        @idsolicitud = ${solicitudv3.idsolicitud},
        @resultcode = @resultcode OUTPUT;
      SELECT @resultcode AS resultcode;
      `)

    if (
      !responseCalc.length ||
      !responseCalc[0].resultcode ||
      responseCalc[0].resultcode !== 1
    ) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    const response = await this.manager.query(`
      DECLARE @resultcode INT;
      EXEC v3.sp_a123GuardarCondiciones
        @idsolicitud = ${solicitudv3.idsolicitud},
        @idpersonal = ${this.ID_PERSONAL},
        ${queryParams};
      SELECT @resultcode AS resultcode;
      `)

    if (!response.length || !response[0].resultcode || response[0].resultcode !== 1) {
      return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
    }

    // CONDICIONES GUARDADAS CORRECTAMENTE
    if (solicitudcredito.pagodeuda) {
      const queryDeudaParams = createQueryParams(deudaexterna, true)

      await this.manager.query(`
        DECLARE @resultcode INT;
        EXEC v3.sp_a123GuardarDatosDeudaExterna
          @idsolicitud = ${solicitudv3.idsolicitud},
          ${queryDeudaParams};
        SELECT @resultcode AS resultcode;
      `)
    }

    if (solicitudcredito.precaptura) {
      const [resultadoRegistrarOrden] = await this.manager.query(`
        DECLARE @resultcode INT;
        EXEC v3.sp_a123RegistrarOrden
          @idsolicitud = ${solicitudv3.idsolicitud},
          @idpersonal = ${this.ID_PERSONAL},
          @resultcode = @resultcode OUTPUT;
        SELECT @resultcode AS resultcode;
      `)

      if (resultadoRegistrarOrden.resultcode !== 1) {
        return new CustomResponse(new Message(SolicitudService.BASE_ERROR_MESSAGE, true))
      }
    }

    const [solicitud] = await this.manager.query(
      `EXEC v3.sp_a123getSolicitudV3ById @idsolicitud = ${solicitudv3.idsolicitud}, @idpersonal = ${this.ID_PERSONAL}`,
    )

    await this.actualizarTrainProcessFlash(11, solicitudv3.idsolicitud)
    await this.manager.query(`
        EXEC tmpmigracion.sp_9000_mig_actualizarCambiosOrden_3_AL_2_ByIdorden
          @idorden = ${solicitud.idOrden},
          @idpersonal = ${this.ID_PERSONAL};
      `)

    return new CustomResponse(new Message('Orden guardada correctamente'), { solicitud })
  }
  // TODO: implementar validaciones existentes en el 3.0

  async actualizarTrainProcessFlash(
    trainProcess: number,
    idSolicitudV3: number,
  ): Promise<void> {
    await this.manager.query(
      `EXEC web.sp_actualizarTrainProcessFlash 
        @trainProcess = ${trainProcess},  
        @idSolicitudv3 = ${idSolicitudV3};`,
    )
  }
}
