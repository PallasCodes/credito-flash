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
  @Auth()
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

    return this.s3Service.uploadFiles(
      [
        files.identificacionFrente[0],
        files.identificacionReverso[0],
        files.comprobanteDom[0],
        files.talonPago[0],
      ],
      idSolicitud,
      +idOrden,
    )
  }
}
