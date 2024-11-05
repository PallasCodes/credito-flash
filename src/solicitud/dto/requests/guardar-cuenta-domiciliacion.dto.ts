import { Type } from 'class-transformer'
import {
  IsObject,
  ValidateNested,
  IsInt,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator'

import { BaseRequestDto } from './base-request.dto'

class CuentaDto {
  @IsInt()
  idtipodispersion: number

  @IsBoolean()
  sincuentadomiciliacion: boolean

  @IsInt()
  idcuentabancaria: number

  @IsInt()
  idtipo: number

  @IsInt()
  idcategoria: number

  @IsInt()
  idbanco: number

  @IsOptional()
  @IsString()
  sucursal?: string

  @IsOptional()
  @IsString()
  cuenta?: string

  @IsOptional()
  @IsString()
  numerotarjeta?: string

  @IsOptional()
  @IsString()
  clabe?: string

  @IsBoolean()
  mismacuenta: boolean
}

export class GuardarCuentaDomiciliacionDto extends BaseRequestDto {
  @Type(() => CuentaDto)
  @ValidateNested()
  @IsObject()
  datos08cuenta01: CuentaDto
}
