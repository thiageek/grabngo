import { INestApplication } from '@nestjs/common'
import { Product } from '@/domain/enterprise/entities/product'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import * as request from 'supertest'
import { OrderStatusNameEnum } from '@prisma/client'

describe('FetchOrdersController', () => {
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

    await bd.orderStatus.findMany().then((r) => {
      if (!r) {
        throw new ResourceNotFound('Order Status not found')
      }

      r.map(async (os) => {
        orderStatus = OrderStatus.create(
          {
            name: os.name,
            description: os.description,
          },
          new UniqueEntityId(os.id),
        )

        order = Order.create({
          status: orderStatus,
          items: [item],
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
      })
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

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/order/`)
      .expect(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body).toHaveLength(5)
    response.body.map((order) => {
      expect(order).toHaveProperty('status')
      expect(order.status).toHaveProperty('name')
      expect(order.status).toHaveProperty('description')
      expect([
        OrderStatusNameEnum.CREATED,
        OrderStatusNameEnum.INQUEUE,
        OrderStatusNameEnum.INPROGRESS,
        OrderStatusNameEnum.READY,
        OrderStatusNameEnum.WAITINGPICKUP,
      ]).toContain(order.status.name)
    })
  })
})
