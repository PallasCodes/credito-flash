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
  @IsOptional()
  idformato?: number | null = 1
}

export class RegistrarContactoDto extends BaseRequestDto {
  @Type(() => ContactoDto)
  @ValidateNested()
  @IsObject()
  contacto: ContactoDto
}
