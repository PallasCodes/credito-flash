import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'usuarioCreditoFlash', schema: 'web' })
export class User {
  @PrimaryGeneratedColumn({ name: 'idUsuarioCreditoFlash' })
  id: number

  @Column({ type: 'varchar', length: 13, nullable: true, name: 'rfc' })
  rfc: string

  @Column({ type: 'int', nullable: true, name: 'idPersonaFisica' })
  idPersonaFisica: number

  @Column({ type: 'varchar', length: 16, nullable: true, name: 'contrasena' })
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
}
