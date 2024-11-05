import { IsNumber } from 'class-validator'

export class SolicitudV3Dto {
  @IsNumber()
  readonly idproductoscc: number

  @IsNumber()
  readonly idtipoorden: number

  @IsNumber()
  readonly idpersonafisica: number

  @IsNumber()
  readonly idvendedor: number
}
