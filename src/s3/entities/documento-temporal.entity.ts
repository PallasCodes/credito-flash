import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'tmp_documentoFlash', schema: 'tmp' })
export class DocumentoTemporal {
  @PrimaryColumn({ type: 'int', name: 'idDocumento' })
  idDocumento: number

  @PrimaryColumn({ type: 'int', name: 'idSolicitudFlash' })
  idSolicitud: number

  @Column('varchar')
  s3Url: string

  @Column('varchar')
  s3Key: string

  @Column('datetime', { nullable: true })
  fechaCreacion?: Date

  @Column('varchar')
  nombreArchivo

  @Column('int')
  tamanoArchivo
}
