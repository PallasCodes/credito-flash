import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsObject,
} from 'class-validator'

import { BaseRequestDto } from './base-request.dto'
import { Type } from 'class-transformer'

class InfoLaboralDto {
  @IsNumber()
  idcliente: number

  @IsNumber()
  identidad: number

  @IsNumber()
  idtipo: number

  @IsNumber()
  idarea: number

  @IsNumber()
  idpuesto: number

  @IsNumber()
  idsindicato: number

  @IsString()
  ndp: string

  @IsDateString()
  fechacontratacion: string

  @IsString()
  telefonotrabajo: string

  @IsString()
  @IsOptional()
  extensiontrabajo?: string | null = null
}

export class GuardarInfoLaboralDto extends BaseRequestDto {
  @Type(() => InfoLaboralDto)
  @ValidateNested()
  @IsObject()
  datos03infolaboral: InfoLaboralDto
}
