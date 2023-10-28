import { OrderItem } from '@/domain/enterprise/entities/order-item'

export class OrderItemPresenter {
  static toHttp(data: OrderItem) {
    return {
      id: data.id.toString(),
      productId: data.productId.toString(),
      observation: data.observation,
    }
  }
}
