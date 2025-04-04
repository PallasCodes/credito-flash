import { Module } from '@nestjs/common';
import { OpenpayService } from './openpay.service';
import { OpenpayController } from './openpay.controller';

@Module({
  controllers: [OpenpayController],
  providers: [OpenpayService]
})
export class OpenpayModule {}
