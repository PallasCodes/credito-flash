import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'eventoOpenpay', schema: 'web' })
export class EventoOpenpay {
  @PrimaryGeneratedColumn('increment')
  idEventoOpenpay: number

  @Column({ type: 'varchar', length: 255 })
  tipoEvento: string

  @Column({ type: 'varchar', length: 255 })
  idTransaccion: string

  @Column({ type: 'datetime' })
  tiempoEvento: Date

  @Column({ type: 'decimal' })
  importe: number
}
