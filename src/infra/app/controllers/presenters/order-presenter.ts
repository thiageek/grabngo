import { Order } from '@/domain/enterprise/entities/order'
import { OrderItemPresenter } from './order-presenter copy'

export class OrderPresenter {
  static toHttp(data: Order) {
    return {
      id: data.id.toString(),
      orderNumber: data.orderNumber,
      status: data.status.value,
      orderItems: data.items.map((i) => OrderItemPresenter.toHttp(i)),
    }
  }
}
