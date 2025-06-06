// import { Archivo } from 'src/s3/entities/archivo.entity'
import { PersonaFisica } from 'src/solicitud/entities/PersonaFisica.entity'
import { SolicitudFlash } from 'src/solicitudes-flash/entities/solicitudFlash.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'

@Entity({ name: 'usuarioCreditoFlash', schema: 'web' })
export class User {
  @PrimaryGeneratedColumn({ name: 'idUsuarioCreditoFlash', type: 'int' })
  id: number

  @Column({ type: 'varchar', length: 13, nullable: true, name: 'rfc' })
  rfc: string

  @OneToOne(() => PersonaFisica)
  @JoinColumn({ name: 'idPersonaFisica' })
  personaFisica: PersonaFisica

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
    name: 'contrasena',
    select: false,
  })
  contrasena: string

  @Column({ type: 'varchar', length: 12, nullable: true, name: 'celular' })
  celular: string

  @Column({
    type: 'datetime',
    default: () => 'getdate()',
    nullable: true,
    name: 'fechaCreacion',
  })
  fechaCreacion: Date

  // @OneToMany(() => Archivo, (archivo) => archivo.usuario, { onDelete: 'CASCADE' })
  // archivos: Archivo[]

  @OneToMany(() => SolicitudFlash, (solicitud) => solicitud.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idSolicitudCreditoFlash' })
  solicitudes: SolicitudFlash[]
}
