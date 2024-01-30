import { Injectable } from '@nestjs/common'
import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'

@Injectable()
export class FindOrderStatus {
  constructor(private readonly repository: OrderRepository) {}

  async execute(filter: string): Promise<OrderStatus> {
    try {
      const status = await this.repository.findStatus(filter)
      if (!status) throw new ResourceNotFound('Order Status not found')
      return status
    } catch (error: any) {
      if (error instanceof ResourceNotFound) throw error
      throw new Error(error)
    }
  }
}
