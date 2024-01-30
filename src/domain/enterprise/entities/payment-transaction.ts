import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  PaymentTransactionGatewayEnum,
  PaymentTransactionMethodEnum,
  PaymentTransactionStatusEnum,
} from '@prisma/client'
import { Optional } from '@/core/helpers/optional'

export interface PaymentTransactionProps {
  orderId: string
  transactionId: string
  transactionStatus: PaymentTransactionStatusEnum
  transactionMethod: PaymentTransactionMethodEnum
  transactionGateway: PaymentTransactionGatewayEnum
  transactionDatetime: Date
  amount: number
  createdAt: Date
}

export class PaymentTransaction extends Entity<PaymentTransactionProps> {
  static create(
    props: Optional<PaymentTransactionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new PaymentTransaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get orderId() {
    return this.props.orderId
  }

  get transactionId() {
    return this.props.transactionId
  }

  get transactionStatus() {
    return this.props.transactionStatus
  }

  get transactionMethod() {
    return this.props.transactionMethod
  }

  get transactionGateway() {
    return this.props.transactionGateway
  }

  get transactionDatetime() {
    return this.props.transactionDatetime
  }

  get amount() {
    return this.props.amount
  }

  get createdAt() {
    return this.props.createdAt
  }
}
