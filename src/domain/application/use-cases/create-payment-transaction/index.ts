import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { Injectable } from '@nestjs/common'
import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import {
  PaymentTransactionGatewayEnum,
  PaymentTransactionMethodEnum,
  PaymentTransactionStatusEnum,
} from '@prisma/client'

export interface InputCreatePaymentTransaction {
  orderId: string
  transactionId: string
  transactionStatus: PaymentTransactionStatusEnum
  transactionMethod: PaymentTransactionMethodEnum
  transactionGateway: PaymentTransactionGatewayEnum
  transactionDatetime: Date
  amount: number
}

export interface OutputCreatePaymentTransaction {
  paymentTransaction: PaymentTransaction
}

@Injectable()
export class CreatePaymentTransaction {
  constructor(private readonly repository: OrderRepository) {}

  async execute({
    orderId,
    transactionId,
    transactionStatus,
    transactionMethod,
    transactionGateway,
    transactionDatetime,
    amount,
  }: InputCreatePaymentTransaction): Promise<OutputCreatePaymentTransaction> {
    const order = await this.repository.findOrder(orderId)

    if (!order) throw new ResourceNotFound('Invalid order')

    const paymentTransaction = PaymentTransaction.create({
      orderId,
      transactionId,
      transactionStatus,
      transactionMethod,
      transactionGateway,
      transactionDatetime,
      amount,
    })

    await this.repository.addPaymentTransaction(paymentTransaction)

    return { paymentTransaction }
  }
}
