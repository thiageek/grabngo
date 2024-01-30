import { OrderStatus } from '@/domain/enterprise/entities/order-status'

describe('Order status', () => {
  it('Should be able create a order status', () => {
    const spy = OrderStatus.create({
      name: 'WAITING',
      description: 'The order is waiting',
    })

    expect(spy).toBeTruthy()
  })
})
