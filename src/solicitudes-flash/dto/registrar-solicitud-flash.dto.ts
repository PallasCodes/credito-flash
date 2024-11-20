import { IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator'

export class RegistrarSolicitudFlashDto {
  @IsOptional()
  @IsInt()
  idUsarioCreditoFlash: number | null

  @IsInt()
  @IsPositive()
  importeSolicitado: number

  @IsInt()
  idPromocion: number
}
