import { UpdateOrderItem } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { OrderStatusNameEnum } from '@prisma/client'

let sut: UpdateOrderItem
let repository: OrderRepository
describe('Update order item', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new UpdateOrderItem(repository)
  })

  it('Should be able update item', async () => {
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

    const updateItem = {
      id: item.id.toString(),
      productId: item.productId.toString(),
      quantity: 3,
      observation: 'test2 observation',
    }

    await sut.execute({
      orderId: order.id.toString(),
      item: updateItem,
    })

    const spy = await repository.findOrder(order.id.toString())
    expect(spy).toBeTruthy()
    expect(spy?.items[0].quantity).toEqual(3)
  })

  it('should not be able throw new error when order is invalid', () => {
    const item = {
      id: new UniqueEntityId().toString(),
      productId: new UniqueEntityId().toString(),
      quantity: 3,
      observation: 'test observation',
    }
    expect(async () => {
      await sut.execute({
        orderId: 'invalid-id',
        item: item,
      })
    }).rejects.toThrow(ResourceNotFound)
  })
})
