import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  PaymentTransactionGatewayEnum,
  PaymentTransactionMethodEnum,
  PaymentTransactionStatusEnum,
} from '@prisma/client'

describe('Payment transaction', () => {
  it('Should be able create a payment transaction', () => {
    const spy = PaymentTransaction.create({
      orderId: new UniqueEntityId().toString(),
      transactionId: new UniqueEntityId().toString(),
      transactionStatus: PaymentTransactionStatusEnum.WAITING,
      transactionMethod: PaymentTransactionMethodEnum.CREDITCARD,
      transactionGateway: PaymentTransactionGatewayEnum.MERCADOPAGO,
      transactionDatetime: new Date(),
      amount: 3000,
    })

    expect(spy).toBeTruthy()
  })
})
