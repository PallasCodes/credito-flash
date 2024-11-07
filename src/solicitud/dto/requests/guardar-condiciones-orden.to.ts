import {
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  IsObject,
} from 'class-validator'
import { BaseRequestDto } from './base-request.dto'
import { Type } from 'class-transformer'

class DeudaExternaDto {
  @IsOptional()
  @IsNumber()
  idbanco: number | null = null

  @IsOptional()
  @IsNumber()
  idempresa: number | null = null

  @IsOptional()
  @IsString()
  referencia: string | null = null

  @IsOptional()
  @IsString()
  periodostransito: string | null = null

  @IsOptional()
  @IsString()
  folio: string | null = null

  @IsOptional()
  @IsDateString()
  fechaventa: string | null = null

  @IsOptional()
  @IsNumber()
  plazo: number | null = null

  @IsOptional()
  @IsNumber()
  descuento: number | null = null

  @IsOptional()
  @IsNumber()
  idtipoperiodo: number | null = null
}

class CondicionesOrdenDto {
  @IsNumber()
  importesolicitado: number

  @IsNumber()
  idpromocion: number

  @IsOptional()
  @IsNumber()
  idseguro?: number | null = null

  @IsOptional()
  @IsNumber()
  idbeneficiario: number | null = null

  @IsOptional()
  deudaexterna: DeudaExternaDto

  @IsDateString()
  fechafirma: string

  @IsNumber()
  idvendedor: number

  @IsNumber()
  identidadfederativafirma: number

  @IsNumber()
  idmunicipiofirma: number

  @IsNumber()
  idmedioentero: number

  @IsOptional()
  @IsString()
  otromedio: string | null = null

  @IsNumber()
  iddestinocredito: number

  @IsOptional()
  @IsString()
  otrodestino: string | null = null

  @IsString()
  comentario: string

  @IsString()
  periodoinicio: string

  @IsOptional()
  @IsString()
  periodofin: string | null = null
}

export class GuardarCondicionesOrdenDto extends BaseRequestDto {
  @Type(() => CondicionesOrdenDto)
  @ValidateNested()
  @IsObject()
  datos11condiciones: CondicionesOrdenDto
}
