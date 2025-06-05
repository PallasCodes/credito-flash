import { extname } from 'path'

import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'

import { PDFDocument } from 'pdf-lib'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

import { CustomResponse, Message } from 'src/utils/customResponse'
import { tiposArchivos } from 'src/types/tipoArchivo.enum'
import { OrdenDocumento } from './entities/ordenDocumento.entity'
import { VerificacionToku } from 'src/solicitud/entities/verificacionToku.entity'
import { DocumentoTemporal } from './entities/documento-temporal.entity'

@Injectable()
export class S3Service {
  ID_PERSONAL = this.configService.get<number>('ID_PERSONAL')
  COMPROBANTE_PAGO = this.configService.get<number>('COMPROBANTE_PAGO')

  private readonly s3Client: S3Client
  private readonly bucketName: string

  constructor(
    @InjectRepository(OrdenDocumento)
    private readonly ordenDocRepository: Repository<OrdenDocumento>,

    @InjectRepository(DocumentoTemporal)
    private readonly docTemporalRepository: Repository<DocumentoTemporal>,

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

  async migrateTempDocs(idSolicitud: number, idOrden: number) {
    const docs = await this.docTemporalRepository.findBy({ idSolicitud })

    if (!docs) return

    const promises = docs.map((doc) => {
      return new Promise(async (accept, reject) => {
        try {
          const docContent: OrdenDocumento = {
            id: doc.idDocumento,
            idOrden,
            idPersonal: this.ID_PERSONAL,
            nombreArchivo: doc.nombreArchivo,
            tamanoArchivo: doc.tamanoArchivo,
            web: 1,
            s3: 1,
            s3Key: doc.s3Key,
            publicUrl: doc.s3Url,
          }

          const newDoc = this.ordenDocRepository.create(docContent)
          await this.ordenDocRepository.save(newDoc)

          accept(true)
        } catch (err) {
          reject(err)
        }
      })
    })

    await this.docTemporalRepository.remove(docs)
    await Promise.allSettled(promises)
    await this.uploadTokuPDf(idSolicitud, idOrden)

    return new CustomResponse(new Message())
  }

  async uploadFiles(files: any[], idSolicitud: number) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos.')
    }

    const uploadPromises = files.map((file) => {
      return new Promise(async (accept, reject) => {
        const codeName = `${idSolicitud}.${tiposArchivos[file.fieldname]}`
        const extension = extname(file.originalname)
        const fileName = `${codeName}.${new Date().getTime()}${extension}`
        const key = `${new Date().getFullYear()}/${idSolicitud}/${fileName}`
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

          const docContent: DocumentoTemporal = {
            idDocumento: Number(tiposArchivos[file.fieldname]),
            idSolicitud: idSolicitud,
            nombreArchivo: fileName,
            tamanoArchivo: file.size ?? 0,
            s3Key: key,
            s3Url: url,
          }
          const document = this.docTemporalRepository.create(docContent)
          await this.docTemporalRepository.save(document)

          accept(document)
        } catch (error) {
          console.error('Error al subir el archivo a S3:', error)
          reject()
        }
      })
    })

    const uploads = await Promise.allSettled(uploadPromises)

    // TODO: update trainProcess
    return new CustomResponse(new Message(), { uploads })
  }

  private async uploadTokuPDf(idSolicitud: number, idOrden: number) {
    const { pdfUrl } = await this.verifTokuRepository.findOneBy({ idSolicitud })

    const codeName = `${idOrden}.${this.COMPROBANTE_PAGO}`
    const fileName = `${codeName}.${new Date().getTime()}.pdf`
    const key = `${new Date().getFullYear()}/${idOrden}/${fileName}`

    const docContent: OrdenDocumento = {
      nombreArchivo: fileName,
      tamanoArchivo: 0,
      s3Key: key,
      id: this.COMPROBANTE_PAGO,
      idOrden,
      idPersonal: this.ID_PERSONAL,
      publicUrl: pdfUrl,
      s3: 1,
    }

    const document = this.ordenDocRepository.create(docContent)
    await this.ordenDocRepository.save(document)
  }

  async mergePdfs(buffer1, buffer2) {
    const mergedPdf = await PDFDocument.create()
    const pdf1 = await PDFDocument.load(buffer1)
    const pdf2 = await PDFDocument.load(buffer2)

    const pages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices())
    pages1.forEach((page) => mergedPdf.addPage(page))

    const pages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices())
    pages2.forEach((page) => mergedPdf.addPage(page))

    return await mergedPdf.save()
  }

  async convertImageBufferToPDF(file) {
    const { buffer, originalname } = file

    const pdfDoc = await PDFDocument.create()

    let image
    if (originalname.toLowerCase().endsWith('.png')) {
      image = await pdfDoc.embedPng(buffer)
    } else if (
      originalname.toLowerCase().endsWith('.jpg') ||
      originalname.toLowerCase().endsWith('.jpeg')
    ) {
      image = await pdfDoc.embedJpg(buffer)
    } else {
      throw new Error('Formato de imagen no soportado. Utiliza PNG o JPG/JPEG.')
    }

    const { width, height } = image.scale(1)

    const page = pdfDoc.addPage([width, height])

    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    })

    return await pdfDoc.save()
  }
}
