import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'

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
