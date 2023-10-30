import { Checkout } from '.'
import { OrderRepository } from '../../repositories/order-repository'
import { MockOrderRepository } from '@test/repositories/mock-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { ProductRepository } from '../../repositories/product-repository'
import { MockProductRepository } from '@/infra/app/repositories/in-memory/mock-product-repository'
import { Product } from '@/domain/enterprise/entities/product'

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

    const order = Order.create({
      clientId: new UniqueEntityId(),
      items: [item],
    })

    await repositoryOrder.saveOrder(order)

    const spy = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(spy).toBeTruthy()
    expect(spy.total).toEqual(100)
  })

  it('should not be able throw new error when order is invalid', () => {
    expect(async () => {
      await sut.execute({
        orderId: 'invalid-id',
      })
    }).rejects.toThrow(ResourceNotFound)
  })
})
