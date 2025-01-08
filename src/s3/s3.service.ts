import { extname } from 'path'

import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

import { CustomResponse, Message } from 'src/utils/customResponse'
import { tiposArchivos } from 'src/types/tipoArchivo.enum'
import { OrdenDocumento } from './entities/ordenDocumento.entity'
import { VerificacionToku } from 'src/solicitud/entities/verificacionToku.entity'

@Injectable()
export class S3Service {
  ID_PERSONAL = this.configService.get<number>('ID_PERSONAL')
  COMPROBANTE_PAGO = this.configService.get<number>('COMPROBANTE_PAGO')

  private readonly s3Client: S3Client
  private readonly bucketName: string

  constructor(
    @InjectRepository(OrdenDocumento)
    private readonly ordenDocRepository: Repository<OrdenDocumento>,

    @InjectRepository(VerificacionToku)
    private readonly verifTokuRepository: Repository<VerificacionToku>,

    private configService: ConfigService,
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

  async uploadFiles(files: any[], idSolicitud: number, idOrden: number) {
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
        ACL: 'public-read',
      }

      try {
        // @ts-ignore
        await this.s3Client.send(new PutObjectCommand(params))

        const url = `https://s3.amazonaws.com/${this.bucketName}/${key}`
        const docContent = {
          id: Number(tiposArchivos[file.fieldname]),
          idOrden: idOrden,
          idPersonal: this.ID_PERSONAL,
          nombreArchivo: fileName,
          tamanoArchivo: file.size,
          web: 1,
          s3: 1,
          s3Key: key,
          publicUrl: url,
        }
        const document = this.ordenDocRepository.create(docContent)
        await this.ordenDocRepository.save(document)

        return document
      } catch (error) {
        console.error('Error al subir el archivo a S3:', error)
        throw new BadRequestException('Error al subir los archivos.')
      }
    })

    const { pdfUrl } = await this.verifTokuRepository.findOneBy({ idSolicitud })

    const uploads = await Promise.all(uploadPromises)

    const codeName = `${idOrden}.${this.COMPROBANTE_PAGO}`
    const fileName = `${codeName}.${new Date().getTime()}.pdf`
    const key = `${new Date().getFullYear()}/${idOrden}/${fileName}`

    const docContent = {
      id: this.COMPROBANTE_PAGO,
      idOrden: idOrden,
      idPersonal: this.ID_PERSONAL,
      nombreArchivo: fileName,
      tamanoArchivo: 0,
      web: 1,
      s3: 1,
      s3Key: key,
      publicUrl: pdfUrl,
    }

    const document = this.ordenDocRepository.create(docContent)
    await this.ordenDocRepository.save(document)

    // TODO: update trainProcess
    return new CustomResponse(new Message(), { uploads })
  }
}
