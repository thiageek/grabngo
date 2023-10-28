import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../../repositories/order-repository'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { NotAllowed } from '@/core/errors/not-allowed.error'
import { Order } from '@/domain/enterprise/entities/order'

export interface Input {
  orderId: string
  itemId: string
}

export interface Output {
  order: Order
}

@Injectable()
export class DeleteOrderItem {
  constructor(private readonly repository: OrderRepository) {}

  async execute({ orderId, itemId }: Input): Promise<Output> {
    const order = await this.repository.findOrder(orderId)

    if (!order) throw new ResourceNotFound('Invalid order')

    if (order.items.length <= 1)
      throw new NotAllowed('Order must have at least one item')
    const item = order.items.find((item) => item.id.toString() === itemId)

    if (!item) throw new ResourceNotFound('Invalid item')

    await this.repository.removeItem(item.id.toString())

    order.removeItem(item)

    await this.repository.saveOrder(order)

    return { order }
  }
}
