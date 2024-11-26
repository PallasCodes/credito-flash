import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SolicitudesFlashService } from './solicitudes-flash.service'
import { SolicitudesFlashController } from './solicitudes-flash.controller'
import { AuthModule } from 'src/auth/auth.module'
import { SolicitudFlash } from './entities/solicitudFlash.entity'

@Module({
  controllers: [SolicitudesFlashController],
  providers: [SolicitudesFlashService],
  imports: [AuthModule, TypeOrmModule.forFeature([SolicitudFlash])],
})
export class SolicitudesFlashModule {}
