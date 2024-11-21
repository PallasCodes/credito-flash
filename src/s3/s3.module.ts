import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { S3Service } from './s3.service'
import { S3Controller } from './s3.controller'
import { Archivo } from './entities/archivo.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [S3Controller],
  providers: [S3Service],
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Archivo]), AuthModule],
})
export class S3Module {}
