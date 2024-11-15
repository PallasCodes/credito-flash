import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { EntityManager, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity'
import { CreateUserDto, LoginUserDto } from './dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { CustomResponse, Message } from 'src/utils/customResponse'
import { PersonaFisica } from 'src/solicitud/entities/PersonaFisica.entity'
import { CreateUserByRfcDto } from './dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(PersonaFisica)
    private readonly personaFisicaRepository: Repository<PersonaFisica>,
    private readonly jwtService: JwtService,
    private manager: EntityManager,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { contrasena, rfc } = createUserDto

      const personaFisica = await this.personaFisicaRepository.findOneBy({ rfc })

      if (!personaFisica) {
        return new BadRequestException('No existe un cliente con este RFC')
      }

      const user = this.userRepository.create({
        rfc,
        contrasena: bcrypt.hashSync(contrasena, 10),
        personaFisica,
      })
      await this.userRepository.save(user)

      return { ...user, token: this.getJwtToken({ id: user.id }) }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  generatePassword(): string {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'

    // Aseguramos que incluimos al menos uno de cada tipo de carácter
    const passwordChars = [
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)],
      numberChars[Math.floor(Math.random() * numberChars.length)],
    ]

    // Completar con caracteres aleatorios de cualquier tipo
    const allChars = uppercaseChars + lowercaseChars + numberChars
    for (let i = passwordChars.length; i < 8; i++) {
      passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)])
    }

    // Mezclar los caracteres para que no siempre sigan el mismo patrón
    return passwordChars.sort(() => 0.5 - Math.random()).join('')
  }

  async registerUserByRfc({ rfc }: CreateUserByRfcDto) {
    const personaFisica = await this.personaFisicaRepository.findOneBy({ rfc })
    if (!personaFisica) {
      return new BadRequestException('No existe un cliente con este RFC')
    }

    const registeredUser = await this.userRepository.findOneBy({ rfc })
    if (registeredUser) {
      return new BadRequestException(
        'El usuario ya se encuentra registrado en la plataforma de Crédito Flash',
      )
    }

    const contrasena = this.generatePassword()
    const user = this.userRepository.create({
      rfc,
      contrasena: bcrypt.hashSync(contrasena, 10),
      personaFisica,
    })
    await this.userRepository.save(user)

    const resultCelular = await this.manager.query(`
      DECLARE @celular VARCHAR(15);
      EXEC dbo.sp_getCelularByRFC
        @rfc = ${rfc}, 
        @celular = @celular OUTPUT;
      SELECT @celular AS celular;
      `)
    if (!resultCelular || !resultCelular.length) {
      return new BadRequestException(
        'No se encontró ningún celular vinculado a una cuenta con este RFC',
      )
    }

    const msg = `Tu contrasena para el portal Crédito Web de Itermercado es: ${contrasena}`
    const res = await this.manager.query('SELECT dbo.fn_Sms(@0,@1) AS res', [
      resultCelular[0].celular,
      msg,
    ])
    console.log(
      '🚀 ~ AuthService ~ registerUserByRfc ~ resultCelular[0].celular:',
      resultCelular[0].celular,
    )
    console.log('🚀 ~ AuthService ~ registerUserByRfc ~ res:', res)

    const token = this.getJwtToken({ id: user.id })
    return new CustomResponse(
      new Message('Se ha enviado un SMS con tu contraseña a tu celular'),
      { ...user, token },
    )
  }

  async login(loginUserDto: LoginUserDto) {
    const { contrasena, rfc } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { rfc },
      select: { rfc: true, contrasena: true, id: true },
    })

    const validPassword = bcrypt.compareSync(contrasena, user.contrasena)

    if (!user || !validPassword) {
      throw new UnauthorizedException('Credenciales no válidas')
    }

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
