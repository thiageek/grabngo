import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import * as request from 'supertest'
import { Product } from '@/domain/enterprise/entities/product'

describe('CreateProductController', () => {
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
      name: 'test',
      price: 50,
      description: 'Product description',
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
            observation: 'test',
          },
        ],
      })
      .expect(201)
  })
})
