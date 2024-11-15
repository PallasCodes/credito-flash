import { PersonaFisica } from 'src/solicitud/entities/PersonaFisica.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'

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
}
