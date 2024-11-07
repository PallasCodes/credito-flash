import { Module } from '@nestjs/common';
import { SolicitudesFlashService } from './solicitudes-flash.service';
import { SolicitudesFlashController } from './solicitudes-flash.controller';

@Module({
  controllers: [SolicitudesFlashController],
  providers: [SolicitudesFlashService]
})
export class SolicitudesFlashModule {}
