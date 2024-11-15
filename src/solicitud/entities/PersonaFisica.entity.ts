import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'personaFisica', schema: 'dbo' })
export class PersonaFisica {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idPersonaFisica' })
  id: number

  @Column('varchar')
  rfc: string
}
