import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common'
import { User } from 'src/auth/entities/user.entity'

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'image/jpg',
  ]
  private readonly maxSize = 5 * 1024 * 1024 // 5 MB

  transform(value: any) {
    if (value instanceof User || typeof value === 'string') return value

    for (const fieldName in value) {
      const file = value[fieldName][0]

      if (!this.allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Tipo de archivo no permitido: ${file.mimetype}. Archivos aceptados jpg, png, jpeg y pdf`,
        )
      }

      if (file.size > this.maxSize) {
        throw new BadRequestException(
          `El archivo es demasiado grande: ${file.originalname}. Tamaño máximo permitido de 5MB`,
        )
      }
    }

    return value
  }
}
