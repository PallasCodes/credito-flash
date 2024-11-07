import { IsInt, Max, Min } from 'class-validator'

export class ActualizarTrainProcessDto {
  @IsInt()
  idsolicitud: number

  @IsInt()
  @Min(1)
  @Max(12)
  trainprocess: number
}
