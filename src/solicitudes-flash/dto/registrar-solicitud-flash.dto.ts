import { IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator'

export class RegistrarSolicitudFlashDto {
  @IsOptional()
  @IsInt()
  idUsuarioCreditoFlash?: number

  @IsInt()
  @IsPositive()
  importeSolicitado: number

  @IsInt()
  idPromocion: number
}
