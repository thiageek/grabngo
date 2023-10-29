import { Injectable } from '@nestjs/common'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderRepository } from '../../repositories/order-repository'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { orderItemsFactory } from '../../factories/order-items-factory'

export interface Input {
  orderId: string
  items: InputOrderItem[]
}

interface InputOrderItem {
  productId: string
  quantity: number
  observation?: string
}

export interface Output {
  order: Order
}

@Injectable()
export class AddOrderItem {
  constructor(private readonly repository: OrderRepository) {}

  async execute({ orderId, items }: Input): Promise<Output> {
    const order = await this.repository.findOrder(orderId)

    if (!order) throw new ResourceNotFound('Invalid order')

    const orderItems = orderItemsFactory(items)

    order.addItem(orderItems)

    await this.repository.saveOrder(order)

    return { order }
  }
}
