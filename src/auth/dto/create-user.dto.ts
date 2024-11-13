import { IsString, IsOptional, IsInt, IsPhoneNumber, Length } from 'class-validator'

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(13, 13)
  rfc?: string

  @IsOptional()
  @IsString()
  @Length(16, 16)
  contrasena?: string

  @IsOptional()
  @IsPhoneNumber(null)
  @Length(10, 12)
  celular?: string

  @IsOptional()
  @IsInt()
  idPersonaFisica: number
}
