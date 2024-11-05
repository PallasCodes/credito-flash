import { IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { BaseRequestDto } from './base-request.dto'

class InfoContactosDto {
  @IsNumber()
  @IsOptional()
  idcontactocelular?: number | null = null

  @IsNumber()
  @IsOptional()
  idcontactoemaillaboral?: number | null = null

  @IsNumber()
  @IsOptional()
  idcontactoemailpersonal?: number | null = null

  @IsNumber()
  @IsOptional()
  idcontactorecados?: number | null = null

  @IsNumber()
  @IsOptional()
  idcontactotelefonocasa?: number | null = null
}

export class GuardarInfoContactosDto extends BaseRequestDto {
  @Type(() => InfoContactosDto)
  @ValidateNested()
  @IsObject()
  datos06infocontactos: InfoContactosDto
}
