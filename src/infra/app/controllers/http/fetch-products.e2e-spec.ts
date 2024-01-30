import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import * as request from 'supertest'

describe('FetchProductsController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const db = app.get(PrismaService)
    await db.product.createMany({
      data: [
        {
          name: 'Product 1',
          price: 10.0,
          description: 'Product 1 description',
        },
        {
          name: 'Product 2',
          price: 20.0,
          description: 'Product 2 description',
        },
        {
          name: 'Product 3',
          price: 30.0,
          description: 'Product 3 description',
        },
      ],
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
    return request(app.getHttpServer()).get('/product').expect(200)
  })
})
