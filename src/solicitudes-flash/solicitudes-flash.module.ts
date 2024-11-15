import { Module } from '@nestjs/common'
import { SolicitudesFlashService } from './solicitudes-flash.service'
import { SolicitudesFlashController } from './solicitudes-flash.controller'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [SolicitudesFlashController],
  providers: [SolicitudesFlashService],
  imports: [AuthModule],
})
export class SolicitudesFlashModule {}
