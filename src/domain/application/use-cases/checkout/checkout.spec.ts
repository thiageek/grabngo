import { Checkout } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { ProductRepository } from '../../repositories/product-repository'
import { MockProductRepository } from '@test/repositories/mock-product-repository'
import { Product } from '@/domain/enterprise/entities/product'
import {
  OrderStatusNameEnum,
  PaymentTransactionStatusEnum,
} from '@prisma/client'
import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'

let sut: Checkout
let repositoryOrder: OrderRepository
let repositoryProduct: ProductRepository
describe('Checkout order', () => {
  beforeEach(() => {
    repositoryOrder = new MockOrderRepository()
    repositoryProduct = new MockProductRepository()
    sut = new Checkout(repositoryOrder, repositoryProduct)
  })

  it('Should be able count total a order', async () => {
    const product = Product.create({
      name: 'Product name',
      description: 'Product description',
      price: 50,
    })

    await repositoryProduct.save(product)

    const item = OrderItem.create({
      productId: product.id,
      quantity: 2,
      observation: 'test observation',
    })

    const status = await repositoryOrder.findStatus(OrderStatusNameEnum.CREATED)

    const order = Order.create({
      clientId: new UniqueEntityId(),
      status: status,
      items: [item],
    })

    await repositoryOrder.saveOrder(order)

    await repositoryOrder.addPaymentTransaction(
      PaymentTransaction.create({
        orderId: order.id.toString(),
        transactionId: 'test-transaction-id',
        transactionStatus: PaymentTransactionStatusEnum.APPROVED,
        transactionMethod: 'CREDITCARD',
        transactionGateway: 'MERCADOPAGO',
        transactionDatetime: new Date(),
        amount: 100,
      }),
    )

    const spy = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(spy).toBeTruthy()
    expect(spy.total).toEqual(100)
    expect(spy.order.paymentStatus).toEqual(
      PaymentTransactionStatusEnum.APPROVED,
    )
  })

  it('should not be able throw new error when order is invalid', () => {
    expect(async () => {
      await sut.execute({
        orderId: 'invalid-id',
      })
    }).rejects.toThrow(ResourceNotFound)
  })
})
