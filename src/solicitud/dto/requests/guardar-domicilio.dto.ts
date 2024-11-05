import { Type } from 'class-transformer'
import {
  IsObject,
  ValidateNested,
  IsString,
  IsNumber,
  IsOptional,
  Length,
  Min,
} from 'class-validator'

import { BaseRequestDto } from './base-request.dto'

class DomicilioDto {
  @IsNumber()
  iddomicilio: number

  @IsString()
  calle: string

  @IsString()
  numero: string

  @IsString()
  @IsOptional()
  interior?: string | null

  @IsString()
  @Length(5, 5)
  cp: string

  @IsString()
  colonia: string

  @IsNumber()
  identidadfederativa: number

  @IsNumber()
  idmunicipio: number

  @IsString()
  @IsOptional()
  entrecalles?: string | null

  @IsString()
  ciudad: string

  @IsNumber()
  @Min(0)
  antanios: number

  @IsNumber()
  @Min(0)
  antmeses: number

  @IsNumber()
  idtipovivienda: number

  @IsOptional()
  @IsString()
  latitud?: string | null

  @IsOptional()
  @IsString()
  longitud?: string | null
}

export class GuardarDomicilioDto extends BaseRequestDto {
  @Type(() => DomicilioDto)
  @ValidateNested()
  @IsObject()
  datos05domicilio: DomicilioDto
}
