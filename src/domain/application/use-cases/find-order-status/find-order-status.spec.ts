import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { FindOrderStatus } from '@/domain/application/use-cases/find-order-status/index'
import { OrderStatusNameEnum } from '@prisma/client'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'

let sut: FindOrderStatus
let repository: MockOrderRepository

describe('Find order status', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new FindOrderStatus(repository)
  })

  it('Should be able to find order status by name', async () => {
    const got = await sut.execute(OrderStatusNameEnum.CREATED)

    expect(got).not.toBeNull()
  })

  it('Should be able to find order status by id', async () => {
    const got = await sut.execute('1')

    expect(got).not.toBeNull()
  })

  it('Should be able to throw an error when order status is not found', async () => {
    expect(async () => {
      return await sut.execute('invalid-status')
    }).rejects.toThrow(ResourceNotFound)
  })
})
