import { IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator'

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
}
