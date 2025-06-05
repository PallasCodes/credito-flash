import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'verificacionToku', schema: 'web' })
export class VerificacionToku {
  @PrimaryGeneratedColumn()
  idVerificacionToku: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  idWebhook: string

  @Column({ type: 'varchar', length: 900, nullable: true })
  pdfUrl: string

  @Column({ type: 'varchar', length: 13 })
  rfcIntroducido: string

  @Column({ type: 'varchar', length: 20 })
  clabeIntroducida: string

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fechaRegistro: Date

  @Column({ type: 'varchar', length: 20, nullable: true })
  clabeReal: string

  @Column({ type: 'varchar', length: 13, nullable: true })
  rfcReal: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  institucionBancaria: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombreCompleto: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  validacion: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  status: string

  @Column({ type: 'varchar', length: 255 })
  idEvento: string

  @Column({ type: 'int', nullable: true })
  idSolicitud: number

  @Column({ type: 'bit', nullable: false, default: 0 })
  fromV3: number
}
