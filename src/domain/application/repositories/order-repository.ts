import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/enterprise/entities/order'

export abstract class OrderRepository {
  abstract saveOrder(data: Order): Promise<void>
  abstract findOrder(filter: string): Promise<Order | null>
  abstract fetchOrder(params: PaginationParams): Promise<Order[]>
  abstract removeItem(id: string): Promise<void>
}
