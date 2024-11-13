import { IsString, IsOptional, IsInt, IsPhoneNumber, Length } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @Length(13, 13)
  rfc: string

  @IsString()
  @Length(8, 16)
  contrasena: string

  @IsOptional()
  @IsPhoneNumber(null)
  @Length(10, 12)
  celular?: string

  @IsOptional()
  @IsInt()
  idPersonaFisica: number
}
