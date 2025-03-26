import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SolicitudService } from './solicitud.service'
import { SolicitudController } from './solicitud.controller'
import { AuthModule } from 'src/auth/auth.module'
import { PersonaFisica } from './entities/PersonaFisica.entity'
import { VerificacionToku } from './entities/verificacionToku.entity'
import { OrdenDocumento } from 'src/s3/entities/ordenDocumento.entity'

@Module({
  controllers: [SolicitudController],
  providers: [SolicitudService],
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forFeature([PersonaFisica, VerificacionToku, OrdenDocumento]),
  ],
})
export class SolicitudModule {}
