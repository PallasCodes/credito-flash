import {
  IsInt,
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsObject,
} from 'class-validator'
import { BaseRequestDto } from './base-request.dto'
import { Type } from 'class-transformer'

export class ReferenciaDto {
  @IsInt()
  idreferencia: number

  @IsString()
  nombre: string

  @IsString()
  apellidopaterno: string

  @IsString()
  apellidomaterno: string

  @IsInt()
  idrelacion: number

  @IsOptional()
  @IsString()
  telefono?: string | null = null

  @IsOptional()
  @IsString()
  celular?: string | null = null

  @IsInt()
  antanios: number

  @IsInt()
  antmeses: number
}

export class GuardarReferenciaDto extends BaseRequestDto {
  @Type(() => ReferenciaDto)
  @ValidateNested()
  @IsObject()
  referencia: ReferenciaDto
}
