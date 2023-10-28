import { Injectable } from '@nestjs/common'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderRepository } from '../../repositories/order-repository'
import { Status } from '@/domain/enterprise/entities/value-objects/status'
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

  async execute({ id, status }: Input): Promise<Output> {
    const order = await this.repository.findOrder(id)

    if (!order) throw new ResourceNotFound('Invalid order')

    if (status) order.status = new Status(status)

    await this.repository.saveOrder(order)

    return { order }
  }
}
