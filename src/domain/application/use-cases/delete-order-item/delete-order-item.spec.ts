import { DeleteOrderItem } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { NotAllowed } from '@/core/errors/not-allowed.error'
import { OrderStatusNameEnum } from '@prisma/client'

let sut: DeleteOrderItem
let repository: OrderRepository
describe('Delete order item', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new DeleteOrderItem(repository)
  })

  it('Should be able delete item', async () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 1,
      observation: 'test observation',
    })

    const item2 = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 1,
      observation: 'test observation',
    })

    const status = await repository.findStatus(OrderStatusNameEnum.CREATED)

    const order = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item, item2],
    })

    await repository.saveOrder(order)

    await sut.execute({
      orderId: order.id.toString(),
      itemId: item.id.toString(),
    })

    const spy = await repository.findOrder(order.id.toString())
    expect(spy).toBeTruthy()
    expect(spy?.items.length).toEqual(1)
  })

  it('should be able throw new error when order is invalid', () => {
    expect(async () => {
      await sut.execute({
        orderId: 'invalid-id',
        itemId: new UniqueEntityId().toString(),
      })
    }).rejects.toThrow(ResourceNotFound)
  })

  it('should be able throw new error when items less than one', async () => {
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

    expect(async () => {
      await sut.execute({
        orderId: order.id.toString(),
        itemId: item.id.toString(),
      })
    }).rejects.toThrow(NotAllowed)
  })

  it('should be able throw new error when item is invalid', async () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 1,
      observation: 'test observation',
    })

    const item2 = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 1,
      observation: 'test observation',
    })

    const status = await repository.findStatus(OrderStatusNameEnum.CREATED)

    const order = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item, item2],
    })

    await repository.saveOrder(order)

    expect(async () => {
      await sut.execute({
        orderId: order.id.toString(),
        itemId: 'invalid item',
      })
    }).rejects.toThrow(ResourceNotFound)
  })
})
