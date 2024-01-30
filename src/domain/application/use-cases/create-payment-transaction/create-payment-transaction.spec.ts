import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { CreatePaymentTransaction } from '.'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  OrderStatusNameEnum,
  PaymentTransactionGatewayEnum,
  PaymentTransactionMethodEnum,
  PaymentTransactionStatusEnum,
} from '@prisma/client'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'

let repository: OrderRepository
let sut: CreatePaymentTransaction
describe('Create payment transaction', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new CreatePaymentTransaction(repository)
  })

  it('Should be able to create a payment transaction', async () => {
    const item = OrderItem.create({
      productId: new UniqueEntityId(),
      quantity: 1,
      observation: 'test observation',
    })

    const status = await repository.findStatus(OrderStatusNameEnum.CREATED)

    const order = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item],
    })

    await repository.saveOrder(order)

    const transactionId = new UniqueEntityId()
    const transactionStatus = PaymentTransactionStatusEnum.WAITING
    const transactionMethod = PaymentTransactionMethodEnum.CREDITCARD
    const transactionGateway = PaymentTransactionGatewayEnum.MERCADOPAGO
    const transactionDatetime = new Date()
    const amount = 3000

    await sut.execute({
      orderId: order.id.toString(),
      transactionId: transactionId.toString(),
      transactionStatus,
      transactionMethod,
      transactionGateway,
      transactionDatetime,
      amount,
    })

    const spy = await repository.findOrder(order.id.toString())
    expect(spy).toBeTruthy()
    expect(spy?.paymentTransactions?.length).toEqual(1)
  })
})
