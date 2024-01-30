import { CreateOrder } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderStatusNameEnum } from '@prisma/client'

let sut: CreateOrder
let repository: OrderRepository
describe('Create order', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new CreateOrder(repository)
  })

  it('Should be able create a order', async () => {
    const clientId = new UniqueEntityId()
    const item = {
      productId: new UniqueEntityId().toString(),
      quantity: 1,
      observation: 'test observation',
    }
    await sut.execute({
      clientId: clientId.toString(),
      items: [item],
    })

    const spy = await repository.fetchOrder({ page: 1 })
    expect(spy[0]).toBeTruthy()
    expect(spy[0].items.length).toEqual(1)
    expect(spy[0].status.name).toEqual(OrderStatusNameEnum.CREATED)
  })
})
