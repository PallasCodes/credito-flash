import { Type } from 'class-transformer'
import {
  IsObject,
  ValidateNested,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator'

import { BaseRequestDto } from './base-request.dto'

class CentroTrabajoDto {
  @IsNumber()
  idcentrotrabajo: number

  @IsNumber()
  idtipo: number

  @IsString()
  @IsOptional()
  clavecentrotrabajo?: string

  @IsString()
  nombre: string

  @IsNumber()
  idmunicipio: number

  @IsString()
  @IsOptional()
  domicilio?: string

  @IsString()
  @IsOptional()
  numero?: string

  @IsString()
  @IsOptional()
  interior?: string

  @IsString()
  colonia: string

  @IsString()
  @Length(5, 5)
  cp: string

  @IsString()
  @IsOptional()
  ciudad?: string

  @IsString()
  telefono: string

  @IsString()
  @IsOptional()
  extension?: string

  @IsNumber()
  identidadfederativa: number
}

export class GuardarCentroTrabajoDto extends BaseRequestDto {
  @Type(() => CentroTrabajoDto)
  @ValidateNested()
  @IsObject()
  datos04centrotrabajo: CentroTrabajoDto
}
