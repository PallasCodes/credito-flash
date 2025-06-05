import { Module } from '@nestjs/common'
import { OpenpayService } from './openpay.service'
import { OpenpayController } from './openpay.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventoOpenpay } from './entities/evento-openpay.entity'

@Module({
  controllers: [OpenpayController],
  providers: [OpenpayService],
  imports: [TypeOrmModule.forFeature([EventoOpenpay])],
})
export class OpenpayModule {}
