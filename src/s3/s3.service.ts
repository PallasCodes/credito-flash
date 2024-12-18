import { extname } from 'path'
import { Injectable, BadRequestException } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { CustomResponse, Message } from 'src/utils/customResponse'
import { InjectRepository } from '@nestjs/typeorm'
import { Archivo } from './entities/archivo.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/entities/user.entity'
import { tiposArchivos } from 'src/types/tipoArchivo.enum'

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client
  private readonly bucketName: string

  constructor(
    @InjectRepository(Archivo) private readonly archivoRepository: Repository<Archivo>,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
    this.bucketName = process.env.AWS_BUCKET_NAME
  }

  async uploadFiles(files: any[], usuario: User, idOrden: number) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos.')
    }

    const uploadPromises = files.map(async (file) => {
      const codeName = `${idOrden}.${tiposArchivos[file.fieldname]}`
      const extension = extname(file.originalname)
      const fileName = `${codeName}.${new Date().getTime()}${extension}`
      const key = `${new Date().getFullYear()}/${idOrden}/${fileName}`
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }

      try {
        await this.s3Client.send(new PutObjectCommand(params))

        const archivo = this.archivoRepository.create({
          key,
          tipoArchivo: file.fieldname,
          usuario,
        })
        await this.archivoRepository.save(archivo)

        return archivo
      } catch (error) {
        console.error('Error al subir el archivo a S3:', error)
        throw new BadRequestException('Error al subir los archivos.')
      }
    })

    const uploads = await Promise.all(uploadPromises)

    // TODO: update trainProcess
    return new CustomResponse(new Message(), { uploads })
  }
}
