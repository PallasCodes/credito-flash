import { IsInt } from 'class-validator'

export class SolicitudV3IdDto {
  @IsInt()
  idsolicitud: number
}
