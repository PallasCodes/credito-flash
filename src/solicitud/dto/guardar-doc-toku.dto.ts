import { IsInt } from 'class-validator'

export class GuardarDocTokuDto {
  @IsInt()
  idOrden: number

  @IsInt()
  idSolicitud: number
}
