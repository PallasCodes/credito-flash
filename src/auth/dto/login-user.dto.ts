import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({ nullable: false })
  @IsString()
  rfc: string

  @ApiProperty({ nullable: false })
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  contrasena: string
}
