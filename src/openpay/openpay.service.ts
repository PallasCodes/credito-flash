import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'

import { EventoOpenpay } from './entities/evento-openpay.entity'

@Injectable()
export class OpenpayService {
  constructor(
    @InjectRepository(EventoOpenpay)
    private readonly eventoOpenpayRepository: Repository<EventoOpenpay>,

    private manager: EntityManager,
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

    await this.insertMovimiento({
      idorden: eventoOpenpay.idOrden,
      tiempo: eventoOpenpay.tiempoEvento.toString().slice(0, -6),
      importe: eventoOpenpay.importe,
    })

    return { status: 'ok' }
  }

  async insertMovimiento(payload: any) {
    await this.manager.query(`
      EXEC intermercado.dbo.sp_insertMovimientoOpenpay
        @idorden = ${payload.idorden},
        @tiempo = '${payload.tiempo}',
        @importe = ${payload.importe}
    `)
  }
}
