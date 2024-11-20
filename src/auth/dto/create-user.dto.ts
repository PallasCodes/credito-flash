import { IsString, IsOptional, Length } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @Length(13, 13)
  rfc: string

  @IsString()
  @Length(8, 16)
  contrasena: string

  @IsString()
  @Length(10, 12)
  celular: string
}

export class CreateUserByRfcDto {
  @IsString()
  @Length(13, 13)
  rfc: string
}
