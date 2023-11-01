import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'

describe('CreateClientController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
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

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/client')
      .send({
        cpf: '123.456.789.10',
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)
  })
})
