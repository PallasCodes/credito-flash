import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'

import { S3Service } from './s3.service'

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'ine', maxCount: 1 },
      { name: 'comprobante', maxCount: 1 },
    ]),
  )
  async uploadFile(
    @UploadedFiles()
    files: {
      ine?: any[]
      comprobante?: any[]
    },
  ) {
    if (!files.ine || !files.ine.length) {
      throw new BadRequestException('El archivo INE es requerido.')
    }

    if (!files.comprobante || !files.comprobante.length) {
      throw new BadRequestException('El archivo Comprobante es requerido.')
    }

    return this.s3Service.uploadFiles([files.ine, files.comprobante])
  }
}
