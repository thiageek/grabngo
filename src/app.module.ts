import { Module } from '@nestjs/common'
import { EnvModule } from './infra/providers/env/env.module'
import { CreateClientController } from './infra/app/controllers/http/create-client.controller'
import { CreateProductController } from '@/infra/app/controllers/http/create-product.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './infra/providers/env/env'
import { CreateClient } from './domain/application/use-cases/create-client'
import { ClientRepository } from './domain/application/repositories/client-repository'
import { PrismaClientRepository } from './infra/app/repositories/prisma/prisma-client-repository'
import { DataModule } from './infra/providers/database/database.module'
import { ProductRepository } from '@/domain/application/repositories/product-repository'
import { PrismaProductRepository } from '@/infra/app/repositories/prisma/prisma-product-repository'
import { CreateProduct } from '@/domain/application/use-cases/create-product'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DataModule,
  ],
  controllers: [CreateClientController, CreateProductController],
  providers: [
    {
      provide: ClientRepository,
      useClass: PrismaClientRepository,
    },
    CreateClient,
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    CreateProduct,
  ],
})
export class AppModule {}
