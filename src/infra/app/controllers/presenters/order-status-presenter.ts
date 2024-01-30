import { OrderStatus } from '@/domain/enterprise/entities/order-status'

export class OrderStatusPresenter {
  static toHttp(data: OrderStatus) {
    return {
      name: data.name,
      description: data.description,
    }
  }
}
