import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { BaseRequestDto } from './base-request.dto'
import { Type } from 'class-transformer'

class ContactoDto {
  @IsBoolean()
  @IsOptional()
  contactarcualquierhorario?: boolean

  @IsString()
  contacto: string

  @IsString()
  @IsOptional()
  horarioantesde?: string | null

  @IsString()
  @IsOptional()
  horariodespuesde?: string | null

  @IsString()
  @IsOptional()
  horariodias?: string | null

  @IsNumber()
  idtipo: number

  @IsNumber()
  idformato: number
}

export class RegistrarContactoDto extends BaseRequestDto {
  @Type(() => ContactoDto)
  @ValidateNested()
  @IsObject()
  contacto: ContactoDto
}
