import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'
import { PaymentTransactionStatusEnum } from '@prisma/client'

export class MockOrderRepository implements OrderRepository {
  orderItemList: OrderItem[] = []
  orders: Order[] = []
  orderStatusList: OrderStatus[] = [
    OrderStatus.create(
      { name: 'CREATED', description: 'Description' },
      new UniqueEntityId('1'),
    ),
    OrderStatus.create(
      { name: 'INQUEUE', description: 'Description' },
      new UniqueEntityId('2'),
    ),
  ]
  paymentTransactionList: PaymentTransaction[] = [
    PaymentTransaction.create(
      {
        orderId: 'order-id-approved',
        transactionId: 'transaction-id',
        transactionStatus: PaymentTransactionStatusEnum.APPROVED,
        transactionMethod: 'CREDITCARD',
        transactionGateway: 'MERCADOPAGO',
        transactionDatetime: new Date(),
        amount: 100,
      },
      new UniqueEntityId('1'),
    ),
  ]
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
    this.orderItemList.splice(itemIndex, 1)
  }

  async findStatus(filter: string): Promise<OrderStatus> {
    const result = this.orderStatusList.find(
      (orderStatus) =>
        orderStatus.name === filter || orderStatus.id.toString() === filter,
    )
    if (!result) {
      throw new ResourceNotFound('Order Status not found')
    }
    return result
  }

  async addPaymentTransaction(data: PaymentTransaction): Promise<void> {
    this.paymentTransactionList.push(data)
    this.orders.map((order) => {
      if (order.id.toValue() === data.orderId) {
        order.paymentTransactions?.push(data)
      }
    })
  }

  async findPaymentStatus(
    orderId: string,
  ): Promise<PaymentTransactionStatusEnum | null> {
    const paymentTransaction = this.paymentTransactionList.find(
      (pt) => pt.orderId === orderId,
    )
    if (!paymentTransaction || !paymentTransaction.transactionStatus)
      return null

    return paymentTransaction.transactionStatus
  }
}
