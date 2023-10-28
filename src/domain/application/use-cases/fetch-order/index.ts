import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../../repositories/order-repository'
import { Order } from '@/domain/enterprise/entities/order'

export interface Input {
  page: number
}

export interface Output {
  orders: Order[]
}

@Injectable()
export class FetchOrders {
  constructor(private readonly repository: OrderRepository) {}
  async execute({ page }: Input): Promise<Output> {
    const orders = await this.repository.fetchOrder({ page })
    return { orders }
  }
}
