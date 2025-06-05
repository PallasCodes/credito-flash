import { User } from 'src/auth/entities/user.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'archivoCreditoFlash', schema: 'web' })
export class Archivo {
  @PrimaryGeneratedColumn({ name: 'idArchivo', type: 'int' })
  id: number

  @Column('varchar')
  key: string

  @Column('varchar')
  tipoArchivo: string

  // @ManyToOne(() => User, (user) => user.archivos)
  // @JoinColumn({
  //   name: 'idUsuarioCreditoFlash',
  // })
  // usuario: User
}
