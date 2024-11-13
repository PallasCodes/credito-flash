import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity'
import { CreateUserDto, LoginUserDto } from './dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { CustomResponse, Message } from 'src/utils/customResponse'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { contrasena, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        contrasena: bcrypt.hashSync(contrasena, 10),
      })
      await this.userRepository.save(user)

      delete user.contrasena
      return { ...user, token: this.getJwtToken({ id: user.id }) }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { contrasena, rfc } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { rfc },
      select: { rfc: true, contrasena: true, id: true },
    })

    if (!user) throw new UnauthorizedException('Credenciales no válidas')

    if (!bcrypt.compareSync(contrasena, user.contrasena))
      throw new UnauthorizedException('Credenciales no válidas')

    // TODO: refac custom message so that sending a new instance of message isnt required
    // TODO: return idPersonaFisica, use transaction

    return new CustomResponse(new Message('Sesión iniciada'), {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    })
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail)

    console.log(error)
    throw new InternalServerErrorException('Check server logs')
  }
}
