import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import * as request from 'supertest'

describe('FindClientController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const db = app.get(PrismaService)
    await db.client.create({
      data: {
        name: 'any_name',
        email: 'any@email.com',
        cpf: 'any_cpf',
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

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/client')
      .query({
        cpf: 'any_cpf',
      })
      .expect(200)
  })
})
