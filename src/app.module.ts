import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
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
import { UpdateProduct } from '@/domain/application/use-cases/update-product'
import { UpdateProductController } from '@/infra/app/controllers/http/update-product.controller'
import { DeleteProductController } from '@/infra/app/controllers/http/delete-product.controller'
import { DeleteProduct } from '@/domain/application/use-cases/delete-product'
import { OrderRepository } from './domain/application/repositories/order-repository'
import { PrismaOrderRepository } from './infra/app/repositories/prisma/prisma-order-repository'
import { CreateOrder } from './domain/application/use-cases/create-order'
import { CreateOrderController } from './infra/app/controllers/http/create-order.controller'
import { FetchOrdersController } from './infra/app/controllers/http/feth-orders.controller'
import { FetchOrder } from './domain/application/use-cases/fetch-order'
import { UpdateOrderController } from './infra/app/controllers/http/update-order.controller'
import { UpdateOrder } from './domain/application/use-cases/update-order'
import { CreateOrderItemController } from './infra/app/controllers/http/create-order-item.controller'
import { AddOrderItem } from './domain/application/use-cases/add-order-item'
import { UpdateOrderItem } from './domain/application/use-cases/update-order-item'
import { DeleteOrderItem } from './domain/application/use-cases/delete-order-item'
import { Checkout } from './domain/application/use-cases/checkout'
import { UpdateOrderItemController } from './infra/app/controllers/http/update-order-item.controller'
import { DeleteOrderItemController } from './infra/app/controllers/http/delete-order-item.controller'
import { CheckoutController } from './infra/app/controllers/http/checkout.controller'
import { AuthModule } from '@/infra/providers/auth/auth.module'
import { SigUpController } from './infra/app/controllers/http/sig-up.controller'
import { CreateUser } from './domain/application/use-cases/create-user'
import { SigInController } from './infra/app/controllers/http/sig-in.controller'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './infra/interceptors/loggin.interceptor'
import { CreateProduct } from './domain/application/use-cases/create-product'
import { FetchProductsController } from './infra/app/controllers/http/fetch-products.controller'
import { FetchProducts } from '@/domain/application/use-cases/fetch-products'
import { FindClientController } from './infra/app/controllers/http/find-client.controller'
import { FindClient } from './domain/application/use-cases/find-client'
import { ValidateClientMiddleware } from './infra/common/middlewares/validate-client.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DataModule,
    AuthModule,
  ],
  controllers: [
    CreateClientController,
    FindClientController,
    CreateProductController,
    UpdateProductController,
    DeleteProductController,
    FetchProductsController,
    CreateOrderController,
    FetchOrdersController,
    UpdateOrderController,
    CreateOrderItemController,
    UpdateOrderItemController,
    DeleteOrderItemController,
    CheckoutController,
    SigUpController,
    SigInController,
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

    CreateClient,
    FindClient,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    FetchProducts,
    CreateOrder,
    FetchOrder,
    UpdateOrder,
    AddOrderItem,
    UpdateOrderItem,
    DeleteOrderItem,
    Checkout,
    CreateUser,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateClientMiddleware)
      .forRoutes({ path: 'order', method: RequestMethod.POST })
  }
}
