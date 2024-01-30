import { Injectable } from '@nestjs/common'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderRepository } from '../../repositories/order-repository'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'

export interface Input {
  id: string
  status?: string
}

export interface Output {
  order: Order
}

@Injectable()
export class UpdateOrder {
  constructor(private readonly repository: OrderRepository) {}

  async execute(input: Input): Promise<Output> {
    const order = await this.repository.findOrder(input.id)

    if (!order) throw new ResourceNotFound('Invalid order')

    if (input.status && input.status !== order.status.name) {
      const status = await this.repository.findStatus(input.status)

      if (!status) throw new ResourceNotFound('Invalid status')

      order.status = status

      await this.repository.saveOrder(order)
    }

    return { order }
  }
}
