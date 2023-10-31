import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import * as request from 'supertest'

describe('CreateProductController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    const db = app.get(PrismaService)
    await db.client.deleteMany({})
  })

  it('/ (POST)', async () => {
    return request(app.getHttpServer())
      .post('/product')
      .send({
        name: 'Product 1',
        price: 10.0,
        description: 'Product 1 description',
        categories: ['Category 1', 'Category 2'],
      })
      .expect(201)
  })
})
