import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from './order'
import { OrderItem } from './order-item'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'

describe('Order', () => {
  it('should be able create order', () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
    })
    const status = OrderStatus.create({
      name: 'CREATED',
      description: 'test',
    })
    const spy = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item],
    })

    expect(spy).toBeTruthy()
    expect(spy.items.length).toEqual(1)
  })

  it('should be able add new item', () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
    })
    const status = OrderStatus.create({
      name: 'CREATED',
      description: 'test',
    })
    const spy = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item],
    })

    const newItem = OrderItem.create({
      productId: new UniqueEntityId(),
    })

    spy.addItem([newItem])

    expect(spy).toBeTruthy()
    expect(spy.items.length).toEqual(2)
  })

  it('should be able add update item', () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 2,
    })

    const status = OrderStatus.create({
      name: 'CREATED',
      description: 'test',
    })

    const spy = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item],
    })

    const updateItem = OrderItem.create(
      {
        productId: item.productId,
        quantity: 3,
      },
      item.id,
    )

    spy.updateItem(updateItem)

    expect(spy).toBeTruthy()
    expect(spy.items[0].quantity).toEqual(3)
  })
})
