import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './auth/auth.module'
import { SolicitudModule } from './solicitud/solicitud.module'
import { CatalogosModule } from './catalogos/catalogos.module'
import { SolicitudesFlashModule } from './solicitudes-flash/solicitudes-flash.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: false,
      options: { encrypt: false, trustServerCertificate: true },
      extra: { requestTimeout: 60000 }, // 60 segundos}
    }),
    AuthModule,
    SolicitudModule,
    CatalogosModule,
    SolicitudesFlashModule,
  ],
})
export class AppModule {}
