import { Module } from '@nestjs/common'

import { SolicitudService } from './solicitud.service'
import { SolicitudController } from './solicitud.controller'
import { AuthModule } from 'src/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PersonaFisica } from './entities/PersonaFisica.entity'
@Module({
  controllers: [SolicitudController],
  providers: [SolicitudService],
  imports: [AuthModule, TypeOrmModule.forFeature([PersonaFisica])],
})
export class SolicitudModule {}
