import { IsInt, IsObject, ValidateNested } from 'class-validator'
import { BaseRequestDto } from './base-request.dto'
import { Type } from 'class-transformer'

class ReferenciasDto {
  @IsInt()
  idreferencia1: number

  @IsInt()
  idreferencia2: number
}

export class GuardarInfoReferenciasDto extends BaseRequestDto {
  @Type(() => ReferenciasDto)
  @ValidateNested()
  @IsObject()
  datos07inforeferencias: ReferenciasDto
}
