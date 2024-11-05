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
  sucursal?: string | null = null

  @IsOptional()
  @IsString()
  cuenta?: string | null = null

  @IsOptional()
  @IsString()
  numerotarjeta?: string | null = null

  @IsOptional()
  @IsString()
  clabe?: string | null = null

  @IsBoolean()
  mismacuenta: boolean
}

export class GuardarCuentaDomiciliacionDto extends BaseRequestDto {
  @Type(() => CuentaDto)
  @ValidateNested()
  @IsObject()
  datos08cuenta01: CuentaDto
}
