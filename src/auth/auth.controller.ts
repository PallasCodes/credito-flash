import { Controller, Post, Body } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { CreateUserDto, LoginUserDto } from './dto'
import { User } from './entities/user.entity'
import { CreateUserByRfcDto } from './dto/create-user.dto'
import { RfcDto } from './dto/rfc.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User was registered', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('signup')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @ApiResponse({ status: 201, description: 'User was logged in', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @ApiResponse({ status: 201, description: 'User was registered', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('signup-by-rfc')
  registerByRfc(@Body() createUserByRfc: CreateUserByRfcDto) {
    return this.authService.registerUserByRfc(createUserByRfc)
  }

  @Post('check-rfc')
  checkRfc(@Body() dto: RfcDto) {
    return this.authService.checkIfUserIsRegistered(dto)
  }
}
