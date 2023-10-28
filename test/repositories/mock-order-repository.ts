import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'

export class MockOrderRepository implements OrderRepository {
  orderItemList: OrderItem[] = []
  orders: Order[] = []
  async saveOrder(data: Order): Promise<void> {
    data.items.forEach((i) => this.orderItemList.push(i))
    this.orders.push(data)
  }
  async fetchOrder({ page }: PaginationParams): Promise<Order[]> {
    return this.orders.slice((page - 1) * 20, page * 20)
  }
  async findOrder(filter: string): Promise<Order | null> {
    const result = this.orders.find((order) => order.id.toValue() === filter)
    return result ?? null
  }

  async removeItem(id: string): Promise<void> {
    const itemIndex = this.orderItemList.findIndex(
      (orderItem) => orderItem.id.toString() == id,
    )
    await this.orderItemList.splice(itemIndex, 1)
  }
}
