import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'

export class PaymentTransactionPresenter {
  static toHttp(data: PaymentTransaction) {
    return {
      id: data.id.toString(),
      orderId: data.orderId.toString(),
      transactionStatus: data.transactionStatus,
      transactionMethod: data.transactionMethod,
      transactionGateway: data.transactionGateway,
      transactionDatetime: data.transactionDatetime,
      amount: data.amount,
      createdAt: data.createdAt,
    }
  }
}
