import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/helpers/optional'
import { OrderItem } from './order-item'
import { randomInt } from 'crypto'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'
import { PaymentTransaction } from './payment-transaction'
import { PaymentTransactionStatusEnum } from '@prisma/client'

export interface OrderProps {
  orderNumber: number
  clientId?: UniqueEntityId | null
  items: OrderItem[]
  status: OrderStatus
  paymentTransactions: PaymentTransaction[] | null
  paymentStatus: PaymentTransactionStatusEnum | null
  createdAt: Date
  updatedAt?: Date | null
}
export class Order extends Entity<OrderProps> {
  static create(
    props: Optional<
      OrderProps,
      'orderNumber' | 'paymentTransactions' | 'paymentStatus' | 'createdAt'
    >,
    id?: UniqueEntityId,
  ) {
    return new Order(
      {
        ...props,
        orderNumber: props.orderNumber ?? randomInt(99) * 10,
        status: props.status,
        paymentTransactions: props.paymentTransactions ?? [],
        paymentStatus: props.paymentStatus ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get orderNumber() {
    return this.props.orderNumber
  }

  get clientId() {
    return this.props.clientId
  }

  get items() {
    return this.props.items
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get paymentTransactions() {
    return this.props.paymentTransactions
  }

  get paymentStatus() {
    return this.props.paymentStatus
  }

  set paymentStatus(value: PaymentTransactionStatusEnum | null) {
    this.props.paymentStatus = value
    this.touch()
  }

  addItem(values: OrderItem[]) {
    values.forEach((value) => this.props.items.push(value))
    this.touch()
  }

  updateItem(value: OrderItem) {
    const index = this.props.items.findIndex((i) => i.id.equals(value.id))
    this.props.items[index] = value
    this.touch()
  }

  removeItem(value: OrderItem) {
    const index = this.props.items.findIndex((i) => i.id.equals(value.id))
    this.props.items.splice(index, 1)
    this.touch()
  }

  get status(): OrderStatus {
    return this.props.status
  }

  set status(value: OrderStatus) {
    this.props.status = value
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
