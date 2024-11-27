import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { CustomExceptionFilter } from './utils/CustomExceptionFilter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  app.useGlobalFilters(new CustomExceptionFilter())
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Crédito Flash')
    .setDescription('Crédito flash Intermercado')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT)
  logger.log(`App running on port ${process.env.PORT}`)
}
bootstrap()
