import { IsNumber } from 'class-validator'

export class SolicitudV3Dto {
  @IsNumber()
  idproductoscc: number

  @IsNumber()
  idtipoorden: number

  @IsNumber()
  idpersonafisica: number

  @IsNumber()
  idvendedor: number
}
