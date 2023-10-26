import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from './order'

describe('Order', () => {
  it('should be able create order', () => {
    const spy = Order.create({
      clientId: new UniqueEntityId(),
    })

    expect(spy).toBeTruthy()
  })
})
