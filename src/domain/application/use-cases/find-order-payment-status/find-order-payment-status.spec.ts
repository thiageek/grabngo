import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { FindOrderPaymentStatus } from './index'
import { PaymentTransactionStatusEnum } from '@prisma/client'

let sut: FindOrderPaymentStatus
let repository: MockOrderRepository

describe('Find order payment status', () => {
  beforeEach(() => {
    repository = new MockOrderRepository()
    sut = new FindOrderPaymentStatus(repository)
  })

  it('Should be able to find order payment status', async () => {
    const got = await sut.execute('order-id-approved')
    expect(got).toEqual(PaymentTransactionStatusEnum.APPROVED)
  })

  it('Should be able to return null when order payment status is not found', async () => {
    const got = await sut.execute('order-id-without-payment')
    expect(got).toBeNull()
  })
})
