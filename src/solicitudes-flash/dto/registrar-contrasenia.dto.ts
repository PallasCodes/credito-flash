import { IsOptional, IsString, Length, Matches } from 'class-validator'

export class RegistrarContraseniaDto {
  @IsString()
  @Length(13, 13)
  @Matches(
    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
    {
      message: 'El RFC no coincide con el formato requerido',
    },
  )
  rfc: string

  @IsString()
  @IsOptional()
  password?: string | null = null
}
