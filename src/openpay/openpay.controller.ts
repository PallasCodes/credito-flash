import { Body, Controller, Post } from '@nestjs/common';
import { OpenpayService } from './openpay.service';

@Controller('openpay')
export class OpenpayController {
  constructor(private readonly openpayService: OpenpayService) { }
  
  @Post('webhook')
  webhook(@Body() body: any) {
    return this.openpayService.handleWebhook(body);
  }
}
