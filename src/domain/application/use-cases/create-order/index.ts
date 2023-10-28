import { Injectable } from '@nestjs/common'
import { Order } from '@/domain/enterprise/entities/order'
import { orderItemsFactory } from '../../factories/order-itens-factory'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderRepository } from '../../repositories/order-repository'

export interface InputCreateOrder {
  clientId?: string
  items: InputOrderItem[]
}

interface InputOrderItem {
  productId: string
  quantity: number
  observation?: string
}

export interface OutputCreateOrder {
  order: Order
}

@Injectable()
export class CreateOrder {
  constructor(private readonly repository: OrderRepository) {}

  async execute({
    items,
    clientId,
  }: InputCreateOrder): Promise<OutputCreateOrder> {
    const orderItems = orderItemsFactory(items)
    const order = Order.create({
      items: orderItems,
      clientId: clientId ? new UniqueEntityId(clientId) : null,
    })

    await this.repository.saveOrder(order)

    return { order }
  }
}
