import { PaymentTransaction as raw, Prisma } from '@prisma/client'
import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PaymentTransactionMapper {
  static toDomain(data: raw) {
    return PaymentTransaction.create(
      {
        orderId: data.orderId,
        transactionId: data.transactionId,
        transactionStatus: data.transactionStatus,
        transactionMethod: data.transactionMethod,
        transactionGateway: data.transactionGateway,
        transactionDatetime: data.transactionDatetime,
        amount: data.amount,
        createdAt: data.createdAt,
      },
      new UniqueEntityId(data.id),
    )
  }

  static toPrisma(
    data: PaymentTransaction,
  ): Prisma.PaymentTransactionUncheckedCreateInput {
    return {
      id: data.id.toString(),
      orderId: data.orderId,
      transactionId: data.transactionId,
      transactionStatus: data.transactionStatus,
      transactionMethod: data.transactionMethod,
      transactionGateway: data.transactionGateway,
      transactionDatetime: data.transactionDatetime,
      amount: data.amount,
      createdAt: data.createdAt,
    }
  }
}
