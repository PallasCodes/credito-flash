import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EventoOpenpay } from './entities/evento-openpay.entity'
import { Repository } from 'typeorm'

@Injectable()
export class OpenpayService {
  constructor(
    @InjectRepository(EventoOpenpay)
    private readonly eventoOpenpayRepository: Repository<EventoOpenpay>,
  ) {}

  handleWebhook(body: any) {
    console.log(body)

    if (body.type === 'verification') {
      return { status: 'ok' }
    }

    const payload = {
      tipoEvento: body.type,
      importe: body.transaction?.amount,
      idTransaccion: body.transaction?.id,
      tiempoCreacion: body.event_date?.replace('T', ' '),
    }

    this.eventoOpenpayRepository.create(payload)
    return this.eventoOpenpayRepository.save(payload)
  }
}
