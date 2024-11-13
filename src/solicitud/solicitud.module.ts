import { Module } from '@nestjs/common'

import { SolicitudService } from './solicitud.service'
import { SolicitudController } from './solicitud.controller'
import { AuthModule } from 'src/auth/auth.module'
@Module({
  controllers: [SolicitudController],
  providers: [SolicitudService],
  imports: [AuthModule],
})
export class SolicitudModule {}
