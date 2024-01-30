import { FetchOrder } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { OrderStatusNameEnum } from '@prisma/client'

let sut: FetchOrder
let repository: OrderRepository
describe('Fetch orders', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new FetchOrder(repository)
  })

  it('Should be able list orders', async () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 1,
      observation: 'test observation',
    })

    const status = await repository.findStatus(OrderStatusNameEnum.CREATED)

    const order = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item],
    })

    await repository.saveOrder(order)

    const spy = await sut.execute({
      page: 1,
    })

    expect(spy.orders.length).toEqual(1)
  })
})
