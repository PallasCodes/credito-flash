import { IsInt } from 'class-validator'

export class CheckConvenioActivoDto {
  @IsInt()
  idEntidad: number

  @IsInt()
  idSolicitud: number
}
