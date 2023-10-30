import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'

describe('SingInController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sig-in')
      .send({
        login: 'admin@grabngo',
        password: 'password',
      })
      .expect(201)
  })

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sig-in')
      .send({
        login: 'admin@grabngo',
        password: 'passwordx',
      })
      .expect(403)
  })
})
