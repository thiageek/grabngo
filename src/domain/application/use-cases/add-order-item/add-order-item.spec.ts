import { AddOrderItem } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'

let sut: AddOrderItem
let repository: OrderRepository
describe('Add order item', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new AddOrderItem(repository)
  })

  it('Should be able add new item', async () => {
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

    const newItem = {
      productId: new UniqueEntityId().toString(),
      quantity: 3,
      observation: 'test2 observation',
    }

    await sut.execute({
      orderId: order.id.toString(),
      items: [newItem],
    })

    const spy = await repository.findOrder(order.id.toString())
    expect(spy).toBeTruthy()
    expect(spy?.items.length).toEqual(2)
  })

  it('should not be able throw new error when order is invalid', () => {
    const item = {
      productId: new UniqueEntityId().toString(),
      quantity: 3,
      observation: 'test observation',
    }
    expect(async () => {
      await sut.execute({
        orderId: 'invalid-id',
        items: [item],
      })
    }).rejects.toThrow(ResourceNotFound)
  })
})
