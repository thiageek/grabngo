import { Injectable } from '@nestjs/common'
import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { PaymentTransactionStatusEnum } from '@prisma/client'

@Injectable()
export class FindOrderPaymentStatus {
  constructor(private readonly repository: OrderRepository) {}

  async execute(orderId: string): Promise<PaymentTransactionStatusEnum | null> {
    try {
      return await this.repository.findPaymentStatus(orderId)
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
