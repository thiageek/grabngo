import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'
import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'
import { PaymentTransactionStatusEnum } from '@prisma/client'

export abstract class OrderRepository {
  abstract saveOrder(data: Order): Promise<void>
  abstract findOrder(filter: string): Promise<Order | null>
  abstract fetchOrder(params: PaginationParams): Promise<Order[]>
  abstract removeItem(id: string): Promise<void>
  abstract findStatus(filter: string): Promise<OrderStatus>
  abstract addPaymentTransaction(data: PaymentTransaction): Promise<void>
  abstract findPaymentStatus(
    orderId: string,
  ): Promise<PaymentTransactionStatusEnum | null>
}
