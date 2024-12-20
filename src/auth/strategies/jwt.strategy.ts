import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

import { Strategy, ExtractJwt } from 'passport-jwt'
import { Repository } from 'typeorm'

import { User } from '../entities/user.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['personaFisica'],
    })

    if (!user) throw new UnauthorizedException('Invalid token')

    return user
  }
}
