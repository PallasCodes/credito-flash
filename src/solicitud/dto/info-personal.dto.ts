import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'

export class InfoPersonalDto {
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
