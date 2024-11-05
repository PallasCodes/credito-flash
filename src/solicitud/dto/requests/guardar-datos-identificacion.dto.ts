import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

import { BaseRequestDto } from './base-request.dto'

export class DatosIdentificacionDto {
  @IsString()
  @Length(18, 18)
  curp: string

  @IsString()
  @IsOptional()
  nss: string

  @IsNumber()
  ididentificacionoficial: number

  @IsDateString()
  fechaexpedicion: string

  @IsNumber()
  @Min(1)
  aniosvigencia: number

  @IsString()
  @Length(13, 13)
  claveidentificacionoficial: string
}

export class GuardarDatosIdentificacionDto extends BaseRequestDto {
  @Type(() => DatosIdentificacionDto)
  @ValidateNested()
  @IsObject()
  datos02datosidentificacion: DatosIdentificacionDto
}
