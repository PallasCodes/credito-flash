import { Type } from 'class-transformer'
import {
  IsObject,
  ValidateNested,
  IsDateString,
  IsInt,
  IsPositive,
} from 'class-validator'

import { BaseRequestDto } from './base-request.dto'

class InfoFinancieraDto {
  @IsDateString()
  q1fecha: string

  @IsInt()
  @IsPositive()
  q1percepciones: number

  @IsInt()
  @IsPositive()
  q1liquido: number

  @IsDateString()
  q2fecha: string

  @IsInt()
  @IsPositive()
  q2percepciones: number

  @IsInt()
  @IsPositive()
  q2liquido: number
}

export class GuardarInfoFinancieraDto extends BaseRequestDto {
  @Type(() => InfoFinancieraDto)
  @ValidateNested()
  @IsObject()
  datos10infofinanciera: InfoFinancieraDto
}
