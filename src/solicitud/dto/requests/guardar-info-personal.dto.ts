import { Type } from 'class-transformer'
import {
  IsObject,
  ValidateNested,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'

import { BaseRequestDto } from './base-request.dto'

class InfoPersonalDto {
  @IsString()
  @Length(1, 100)
  apellidopaterno: string

  @IsString()
  @Length(1, 100)
  apellidomaterno: string

  @IsString()
  @Length(1, 100)
  nombre1: string

  @IsString()
  @IsOptional()
  nombre2: string

  @IsDateString()
  fechanacimiento: string

  @IsNumber()
  identidadfederativanacimiento: number

  @IsNumber()
  idestadocivil: number

  @IsNumber()
  idgradoestudios: number

  @IsNumber()
  idnacionalidad: number

  @IsNumber()
  idpaisnacimiento: number

  @IsString()
  @Length(13, 13)
  rfc: string

  @IsIn(['M', 'F'])
  sexo: string

  @IsNumber()
  @Min(0)
  dependientes: string
}

export class GuardarInfoPersonalDto extends BaseRequestDto {
  @Type(() => InfoPersonalDto)
  @ValidateNested()
  @IsObject()
  datos01infopersonal: InfoPersonalDto
}
