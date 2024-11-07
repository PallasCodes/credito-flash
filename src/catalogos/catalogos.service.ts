import { Injectable } from '@nestjs/common'
import { CustomResponse, Message } from 'src/utils/customResponse'
import { EntityManager } from 'typeorm'

@Injectable()
export class CatalogosService {
  constructor(private manager: EntityManager) {}

  async getElementosPorTipo(codigo: number) {
    if (!codigo) {
      return new CustomResponse(new Message('El código del catálogo es requerido', true))
    }

    const elementos = await this.manager.query(`
      EXEC v3.sp_getElementosCatalogoSistema
        @idcategoria = ${codigo};
      `)

    return new CustomResponse(new Message(), { elementos })
  }

  async getElementosVariosPorCodigo(codigo: number) {
    if (!codigo) {
      return new CustomResponse(new Message('El código del catálogo es requerido', true))
    }

    const elementos = await this.manager.query(`
      EXEC v3.sp_getElementosCatalogoVarios
        @mode = ${codigo},
        @idfiltro = ${null};
      `)

    return new CustomResponse(new Message(), { elementos })
  }

  async getColoniasPorCodigoPostal(cp: number) {
    if (!cp) {
      return new CustomResponse(new Message('El código postal es requerido', true))
    }

    const colonias = await this.manager.query(`
      EXEC v3.sp_getColoniasSepomex
        @cp = ${cp};
      `)

    return new CustomResponse(new Message(), { colonias })
  }
}
