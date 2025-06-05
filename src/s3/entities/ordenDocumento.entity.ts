import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'ordenDocumento', schema: 'dbo' })
export class OrdenDocumento {
  @PrimaryColumn({ name: 'idDocumento', type: 'int' })
  id: number

  @PrimaryColumn('int')
  idOrden: any

  @Column('datetime')
  tiempoCreacion?: Date

  @Column('datetime', { nullable: true })
  tiempoActualizacion?: number

  @Column('int', { nullable: true })
  idPersonal: number

  @Column('int', { nullable: true })
  idPersonalActualizacion?: number

  @Column('varchar', { length: 300, nullable: true })
  nombreArchivo: string

  @Column('bit', { default: 0, nullable: true })
  entregoFisico?: number

  @Column('varchar', { length: 1000, nullable: true })
  observaciones?: string

  @Column('bit', { default: 0, nullable: true })
  web?: number

  @Column('bit', { default: 0, nullable: true })
  cancelado?: number

  @Column('decimal', { nullable: true })
  tamanoArchivo: number

  @Column('bit', { default: 0, nullable: true })
  s3: number

  @Column('varchar', { length: 300, nullable: true })
  s3Key: string

  @Column('bit', { default: 0, nullable: true })
  cargado?: number

  @Column('varchar', { length: 1000, nullable: true })
  publicUrl: string
}
