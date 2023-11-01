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
    const bd = app.get(PrismaService)
    await bd.client.deleteMany({})
    await bd.productCategories.deleteMany()
    await bd.item.deleteMany()
    await bd.order.deleteMany()
    await bd.product.deleteMany()
    await bd.category.deleteMany()
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
