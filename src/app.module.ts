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
import { CreateProduct } from 'src/domain/application/use-cases/create-product'
import { UpdateProduct } from '@/domain/application/use-cases/update-product'
import { UpdateProductController } from '@/infra/app/controllers/http/update-product.controller'
import { DeleteProductController } from '@/infra/app/controllers/http/delete-product.controller'
import { DeleteProduct } from '@/domain/application/use-cases/delete-product'
import { OrderRepository } from './domain/application/repositories/order-repository'
import { PrismaOrderRepository } from './infra/app/repositories/prisma/prisma-order-repository'
import { CreateOrder } from './domain/application/use-cases/create-order'
import { CreateOrderController } from './infra/app/controllers/http/create-order.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DataModule,
  ],
  controllers: [
    CreateClientController,
    CreateProductController,
    UpdateProductController,
    DeleteProductController,
    CreateOrderController,
  ],
  providers: [
    {
      provide: ClientRepository,
      useClass: PrismaClientRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    CreateOrder,
    CreateClient,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
  ],
})
export class AppModule {}
