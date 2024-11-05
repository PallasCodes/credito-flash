import { Type } from 'class-transformer'
import { IsNumber, IsObject, ValidateNested } from 'class-validator'

import { SolicitudV3Dto } from '../solicitud-v3.dto'

export class IniciarSolicitudDto {
  @Type(() => SolicitudV3Dto)
  @ValidateNested()
  @IsObject()
  solicitudv3: SolicitudV3Dto
}
