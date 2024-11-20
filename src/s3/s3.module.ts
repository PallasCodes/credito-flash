import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { S3Service } from './s3.service'
import { S3Controller } from './s3.controller'

@Module({
  controllers: [S3Controller],
  providers: [S3Service],
  imports: [ConfigModule.forRoot()],
})
export class S3Module {}
