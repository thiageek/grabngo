import { Module } from '@nestjs/common'
import { EnvModule } from './infra/providers/env/env.module'
import { CreateClientController } from './infra/app/controllers/http/create-client.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './infra/providers/env/env'
import { CreateClient } from './domain/application/use-cases/create-client'
import { ClientRepository } from './domain/application/repositories/client-repository'
import { PrismaClientRepository } from './infra/app/repositories/prisma/prisma-client-repository'
import { DataModule } from './infra/providers/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DataModule,
  ],
  controllers: [CreateClientController],
  providers: [
    {
      provide: ClientRepository,
      useClass: PrismaClientRepository,
    },
    CreateClient,
  ],
})
export class AppModule {}
