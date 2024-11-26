import { IsString, Length } from 'class-validator'

export class RfcDto {
  @IsString()
  @Length(13)
  rfc: string
}
