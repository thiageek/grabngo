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
    await db.productCategories.deleteMany()
    await db.product.deleteMany()
    await db.category.deleteMany()
  })

  it('/ (POST)', async () => {
    const authResponse = await request(app.getHttpServer())
      .post('/auth/sig-in')
      .send({
        login: 'admin@grabngo',
        password: 'password',
      })
      .expect(201)

    const authToken = authResponse.body.token

    return await request(app.getHttpServer())
      .post('/product')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'name e2e',
        price: 10.0,
        description: 'description e2e',
      })
      .expect(201)
  })
})
