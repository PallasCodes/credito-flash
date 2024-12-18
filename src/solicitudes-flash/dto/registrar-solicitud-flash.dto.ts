import { IsInt, IsOptional, IsPositive } from 'class-validator'

export class RegistrarSolicitudFlashDto {
  @IsOptional()
  @IsInt()
  idUsuarioCreditoFlash?: number | null = null

  @IsInt()
  @IsPositive()
  importeSolicitado: number

  @IsInt()
  idPromocion: number

  @IsInt()
  idSolicitudV3: number

  @IsOptional()
  @IsInt()
  trainProcess?: number | null = 1
}
