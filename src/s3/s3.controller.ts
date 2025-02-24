import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'

import { S3Service } from './s3.service'
import { Auth } from 'src/auth/decorators'
import { FileValidationPipe } from './validateField.pipe'

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  // @Auth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'identificacionFrente', maxCount: 1 },
      { name: 'identificacionReverso', maxCount: 1 },
      { name: 'comprobanteDom', maxCount: 1 },
      { name: 'talonPago', maxCount: 1 },
    ]),
  )
  @UsePipes(FileValidationPipe)
  async uploadFile(
    @UploadedFiles()
    files: {
      identificacionFrente?: any[]
      identificacionReverso?: any[]
      comprobanteDom?: any[]
      talonPago?: any[]
    },
    @Body('idOrden') idOrden: string,
    @Body('idSolicitud') idSolicitud: number,
  ) {
    if (!files.identificacionFrente || !files.identificacionFrente.length) {
      throw new BadRequestException('El archivo INE es requerido.')
    }

    if (!files.identificacionReverso || !files.identificacionReverso.length) {
      throw new BadRequestException('El archivo INE es requerido.')
    }

    if (!files.comprobanteDom || !files.comprobanteDom.length) {
      throw new BadRequestException('El archivo Comprobante es requerido.')
    }

    if (!files.talonPago || !files.talonPago.length) {
      throw new BadRequestException('El archivo Talón de pago es requerido.')
    }

    const ineFrontal = files.identificacionFrente[0].mimetype.includes('image')
      ? await this.s3Service.convertImageBufferToPDF(files.identificacionFrente[0])
      : files.identificacionFrente[0].buffer

    const ineReverso = files.identificacionReverso[0].mimetype.includes('image')
      ? await this.s3Service.convertImageBufferToPDF(files.identificacionReverso[0])
      : files.identificacionReverso[0].buffer

    const ineBuffer = await this.s3Service.mergePdfs(ineFrontal, ineReverso)

    const ine = {
      buffer: ineBuffer,
      mimetype: 'application/pdf',
      originalname: 'ine.pdf',
      fieldname: 'ine',
    }

    return this.s3Service.uploadFiles(
      [ine, files.comprobanteDom[0], files.talonPago[0]],
      idSolicitud,
      +idOrden,
    )
  }
}
