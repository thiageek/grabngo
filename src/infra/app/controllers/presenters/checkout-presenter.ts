import { Order } from '@/domain/enterprise/entities/order'
import { Product } from '@/domain/enterprise/entities/product'

export type productCheckout = {
  name: string
  quantity: number
  price: number
  subTotal: number
}

export class CheckoutPresenter {
  static toHttp(order: Order, products: Product[], total: number) {
    const productResponse: productCheckout[] = []
    products.forEach((product) => {
      order.items.forEach((i) => {
        if (i.productId.equals(product.id)) {
          productResponse.push({
            name: product.name,
            quantity: i.quantity,
            price: product.price,
            subTotal: product.price * i.quantity,
          })
        }
      })
    })

    return {
      products: productResponse,
      orderNumber: order.orderNumber,
      total,
      paymentStatus: order.paymentStatus,
    }
  }
}
