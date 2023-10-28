import { UpdateOrder } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'

let sut: UpdateOrder
let repository: OrderRepository
describe('Update order', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new UpdateOrder(repository)
  })

  it('Should be able update a order', async () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 1,
      observation: 'test observation',
    })

    const order = Order.create({
      clientId: new UniqueEntityId(),
      items: [item],
    })

    await repository.saveOrder(order)

    await sut.execute({
      id: order.id.toString(),
      status: 'in-queue',
    })

    const spy = await repository.findOrder(order.id.toString())
    expect(spy).toBeTruthy()
    expect(spy?.status.value).toEqual('in-queue')
  })

  it('should not be able throw new error when order is invalid', () => {
    expect(async () => {
      await sut.execute({
        id: 'invalid-id',
        status: 'in-queue',
      })
    }).rejects.toThrow(ResourceNotFound)
  })
})
