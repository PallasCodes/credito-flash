import { IsInt, IsString } from 'class-validator'

export class ValidarClabeTokuDto {
  @IsString()
  clabe: string

  @IsString()
  rfc: string

  @IsInt()
  idsolicitud: number
}
