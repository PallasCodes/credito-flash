import { IsNumber } from 'class-validator'

export class SolicitudV3IdDto {
  @IsNumber()
  readonly idsolicitud: number
}
