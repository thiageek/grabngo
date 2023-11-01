import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { Product } from '@/domain/enterprise/entities/product'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { Order } from '@/domain/enterprise/entities/order'
import { faker } from '@faker-js/faker'

describe('CheckoutController', () => {
  let app: INestApplication
  let product: Product
  let item: OrderItem
  let order: Order

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

    order = Order.create({
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
        status: order.status.value,
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
  })

  afterEach(async () => {
    const db = app.get(PrismaService)
    await db.productCategories.deleteMany()
    await db.item.deleteMany()
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
          total: 100,
        })
      })
  })
})
