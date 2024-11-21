import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'

import { S3Service } from './s3.service'
import { Auth, GetUser } from 'src/auth/decorators'
import { User } from 'src/auth/entities/user.entity'
import { FileValidationPipe } from './validateField.pipe'

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @Auth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'ine', maxCount: 1 },
      { name: 'comprobante', maxCount: 1 },
    ]),
  )
  @UsePipes(FileValidationPipe)
  async uploadFile(
    @UploadedFiles()
    files: {
      ine?: any[]
      comprobante?: any[]
    },
    @GetUser() user: User,
  ) {
    if (!files.ine || !files.ine.length) {
      throw new BadRequestException('El archivo INE es requerido.')
    }

    if (!files.comprobante || !files.comprobante.length) {
      throw new BadRequestException('El archivo Comprobante es requerido.')
    }

    return this.s3Service.uploadFiles([files.ine[0], files.comprobante[0]], user)
  }
}
