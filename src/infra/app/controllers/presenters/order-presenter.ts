import { Order } from '@/domain/enterprise/entities/order'
import { OrderItemPresenter } from './order-item-presenter'
import { OrderStatusPresenter } from './order-status-presenter'

export class OrderPresenter {
  static toHttp(data: Order) {
    return {
      id: data.id.toString(),
      orderNumber: data.orderNumber,
      orderItems: data.items.map((i) => OrderItemPresenter.toHttp(i)),
      status: OrderStatusPresenter.toHttp(data.status),
    }
  }
}
