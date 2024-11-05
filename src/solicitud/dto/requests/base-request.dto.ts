import { Type } from 'class-transformer'
import { IsObject, ValidateNested } from 'class-validator'

import { SolicitudV3IdDto } from '../solicitud-v3-id.dto'

export class BaseRequestDto {
  @Type(() => SolicitudV3IdDto)
  @ValidateNested()
  @IsObject()
  solicitudv3: SolicitudV3IdDto
}
