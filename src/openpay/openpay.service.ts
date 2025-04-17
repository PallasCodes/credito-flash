import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EventoOpenpay } from './entities/evento-openpay.entity'
import { Repository } from 'typeorm'

@Injectable()
export class OpenpayService {
  constructor(
    @InjectRepository(EventoOpenpay)
    private readonly eventoOpenpayRepository: Repository<EventoOpenpay>,
  ) {}

  async handleWebhook(body: any) {
    if (body.type === 'verification') {
      return { status: 'ok' }
    }
    if (body.type !== 'charge.succeeded') {
      throw new BadRequestException('Tipo de evento no soportado')
    }

    const eventoOpenpay = await this.eventoOpenpayRepository.findOneBy({
      idTransaccion: body.transaction.id,
    })

    if (!eventoOpenpay) {
      throw new NotFoundException()
    }

    eventoOpenpay.tipoEvento = body.type
    eventoOpenpay.importe = body.transaction.amount
    eventoOpenpay.tiempoEvento = body.transaction.creation_date?.replace('T', ' ')

    await this.eventoOpenpayRepository.save(eventoOpenpay)

    return { status: 'ok' }
  }
}
