import { Injectable } from '@nestjs/common'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderRepository } from '../../repositories/order-repository'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { orderItemsFactory } from '../../factories/order-items-factory'

export interface Input {
  orderId: string
  item: InputOrderItem
}

interface InputOrderItem {
  id: string
  productId: string
  observation?: string
}

export interface Output {
  order: Order
}

@Injectable()
export class UpdateOrderItem {
  constructor(private readonly repository: OrderRepository) {}

  async execute({ orderId, item }: Input): Promise<Output> {
    const order = await this.repository.findOrder(orderId)

    if (!order) throw new ResourceNotFound('Invalid order')

    const orderItem = orderItemsFactory([item])

    order.updateItem(orderItem[0])

    await this.repository.saveOrder(order)

    return { order }
  }
}
