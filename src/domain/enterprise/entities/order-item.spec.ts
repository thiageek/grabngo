import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderItem } from './order-item'

describe('Order item', () => {
  it('should be able create a order item', () => {
    const spy = OrderItem.create({
      productId: new UniqueEntityId(),
    })

    expect(spy).toBeTruthy()
  })
})
