import { Injectable, BadRequestException } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { CustomResponse, Message } from 'src/utils/customResponse'

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client
  private readonly bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
    this.bucketName = process.env.AWS_BUCKET_NAME
  }

  async uploadFiles(files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos.')
    }

    const uploadPromises = files.map(async (file) => {
      console.log(file)
      const key = `${uuidv4()}-${file.originalname}`
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }

      try {
        await this.s3Client.send(new PutObjectCommand(params))
        const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

        return url
      } catch (error) {
        console.error('Error al subir el archivo a S3:', error)
        throw new BadRequestException('Error al subir los archivos.')
      }
    })

    const uploads = await Promise.all(uploadPromises)

    return new CustomResponse(new Message(), { uploads })
  }
}
