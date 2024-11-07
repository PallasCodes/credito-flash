import { Controller, Get, Query } from '@nestjs/common'
import { CatalogosService } from './catalogos.service'

@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('get-elementos-por-tipo')
  getElementosPorTipo(@Query('codigo') codigo: number) {
    return this.catalogosService.getElementosPorTipo(codigo)
  }

  @Get('get-elementos-varios-por-codigo')
  getElementosVariosPorCodigo(@Query('codigo') codigo: number) {
    return this.catalogosService.getElementosVariosPorCodigo(codigo)
  }

  @Get('get-colonias-por-codigo-postal')
  getColoniasPorCodigoPostal(@Query('cp') cp: number) {
    return this.catalogosService.getColoniasPorCodigoPostal(cp)
  }
}
