import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { Product } from '@/domain/enterprise/entities/product'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { Order } from '@/domain/enterprise/entities/order'
import { faker } from '@faker-js/faker'
import { OrderStatusNameEnum } from '@prisma/client'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('CheckoutController', () => {
  let app: INestApplication
  let product: Product
  let item: OrderItem
  let order: Order
  let orderStatus: OrderStatus

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    const bd = app.get(PrismaService)
    product = Product.create({
      name: faker.lorem.word(),
      price: 50,
      description: faker.lorem.text(),
    })

    item = OrderItem.create({
      quantity: 2,
      productId: product.id,
    })

    await bd.orderStatus
      .findFirst({
        where: {
          name: OrderStatusNameEnum.CREATED,
        },
      })
      .then((r) => {
        if (!r) {
          throw new ResourceNotFound('Order Status not found')
        }

        orderStatus = OrderStatus.create(
          {
            name: r.name,
            description: r.description,
          },
          new UniqueEntityId(r.id),
        )
      })

    order = Order.create({
      status: orderStatus,
      items: [item],
    })

    await bd.product.create({
      data: {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
      },
    })

    await bd.order.create({
      data: {
        id: order.id.toString(),
        orderNumber: order.orderNumber,
        statusId: orderStatus.id.toString(),
        clientId: order.clientId?.toString(),
        updatedAt: order.updatedAt,
        createdAt: order.createdAt,
      },
    })

    await bd.item.create({
      data: {
        id: item.id.toString(),
        orderId: order.id.toString(),
        productId: item.productId.toString(),
        quantity: item.quantity,
        observation: item.observation,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    })

    await bd.paymentTransaction.create({
      data: {
        orderId: order.id.toString(),
        transactionId: new UniqueEntityId().toString(),
        transactionStatus: 'WAITING',
        transactionMethod: 'CREDITCARD',
        transactionGateway: 'MERCADOPAGO',
        transactionDatetime: new Date(),
        amount: 100,
        createdAt: new Date(),
      },
    })

    await bd.paymentTransaction.create({
      data: {
        orderId: order.id.toString(),
        transactionId: new UniqueEntityId().toString(),
        transactionStatus: 'APPROVED',
        transactionMethod: 'CREDITCARD',
        transactionGateway: 'MERCADOPAGO',
        transactionDatetime: new Date(),
        amount: 100,
        createdAt: new Date(),
      },
    })
  })

  afterEach(async () => {
    const db = app.get(PrismaService)
    await db.productCategories.deleteMany()
    await db.item.deleteMany()
    await db.paymentTransaction.deleteMany()
    await db.order.deleteMany()
    await db.product.deleteMany()
    await db.category.deleteMany()
  })

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .get(`/order/${order.id.toString()}/checkout`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          products: [
            {
              name: product.name,
              quantity: 2,
              price: 50,
              subTotal: 100,
            },
          ],
          orderNumber: order.orderNumber,
          total: 100,
          paymentStatus: 'APPROVED',
        })
      })
  })
})
