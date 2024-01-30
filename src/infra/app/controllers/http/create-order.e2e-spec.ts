import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import * as request from 'supertest'
import { Product } from '@/domain/enterprise/entities/product'
import { faker } from '@faker-js/faker'

describe('CreateOrderController', () => {
  let app: INestApplication
  let product: Product

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    const bd = app.get(PrismaService)
    product = Product.create({
      name: faker.lorem.word(),
      price: 50,
      description: faker.lorem.paragraph(),
    })

    await bd.product.create({
      data: {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
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

  it('/ (POST)', async () => {
    return request(app.getHttpServer())
      .post('/order')
      .send({
        items: [
          {
            productId: product.id.toString(),
            quantity: 1,
            observation: faker.lorem.word(),
          },
        ],
      })
      .expect(201)
  })

  it('/ (POST)', async () => {
    return request(app.getHttpServer())
      .post('/order')
      .send({
        items: [
          {
            productId: product.id.toString(),
            quantity: 1,
            observation: faker.lorem.word(),
          },
        ],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toHaveProperty('name')
        expect(res.body.status.name).toBe('CREATED')
      })
  })
})
