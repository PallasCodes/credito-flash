import { Type } from 'class-transformer'
import { IsNumber, IsObject, ValidateNested } from 'class-validator'

import { BaseRequestDto } from './base-request.dto'

class PromocionDto {
  @IsNumber()
  idpromocion: number
}

export class SeleccionarPromocionDto extends BaseRequestDto {
  @Type(() => PromocionDto)
  @ValidateNested()
  @IsObject()
  promocion: PromocionDto
}
