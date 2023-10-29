import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../../repositories/order-repository'
import { Order } from '@/domain/enterprise/entities/order'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { ProductRepository } from '../../repositories/product-repository'
import { Product } from '@/domain/enterprise/entities/product'

export interface Input {
  orderId: string
}

export interface Output {
  order: Order
  products: Product[]
  total: number
}

@Injectable()
export class Checkout {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}
  async execute({ orderId }: Input): Promise<Output> {
    const products: Product[] = []
    const subTotal: number[] = []

    const order = await this.orderRepository.findOrder(orderId)
    if (!order) throw new ResourceNotFound('Invalid order')

    for (const orderItem of order.items) {
      const product = await this.productRepository.find(
        orderItem.productId.toString(),
      )
      if (product) {
        products.push(product)
        subTotal.push(orderItem.quantity * product.price)
      }
    }

    const total = subTotal.reduce((amount, subTotal) => amount + subTotal, 0)

    return {
      order,
      products,
      total,
    }
  }
}
