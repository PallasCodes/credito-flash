import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'usuarioCreditoFlash', schema: 'web' })
export class User {
  @PrimaryGeneratedColumn({ name: 'idUsuarioCreditoFlash', type: 'int' })
  id: number

  @Column({ type: 'varchar', length: 13, nullable: true, name: 'rfc' })
  rfc: string

  @Column({ type: 'int', nullable: true, name: 'idPersonaFisica' })
  idPersonaFisica: number

  @Column({ type: 'varchar', length: 250, nullable: true, name: 'contrasena' })
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
