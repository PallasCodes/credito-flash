import { User } from 'src/auth/entities/user.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'flash_SolicitudCreditoFlash', schema: 'web' })
export class SolicitudFlash {
  @PrimaryGeneratedColumn({ name: 'idSolicitudCreditoFlash', type: 'int' })
  id: number

  @Column('int', { nullable: true })
  idSolicitudV3?: number

  @Column('datetime')
  fechaCreacion: Date

  @Column('int')
  importeSolicitado: number

  @Column('int')
  idPromocion: number

  @ManyToOne(() => User, (user) => user.solicitudes)
  @JoinColumn({ name: 'idUsuarioCreditoFlash' })
  user: User

  @Column('int')
  trainProcess: number
}
