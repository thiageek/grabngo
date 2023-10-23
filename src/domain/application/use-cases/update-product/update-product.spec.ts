import { UpdateProduct } from './index'
import { MockProductRepository } from '@/infra/app/repositories/in-memory/mock-product-repository'
import { Product } from "@/domain/enterprise/entities/product"

let sut: UpdateProduct
let repository: MockProductRepository
let product: Product
describe('Update product', () => {
  beforeEach(() => {
    repository = new MockProductRepository()
    sut = new UpdateProduct(repository)
    product = Product.create({
      name: 'Product Name',
      price: 14.99,
      description: 'Product description',
    })
    repository.mockProducts.push(product)
  })

  it('Should be able to update a product', async () => {
    await sut.execute({
      id: product.id.toString(),
      name: 'Product New Name',
      price: 42,
      description: 'Product new description',
    })

    const spy = await repository.find('Product New Name')
    expect(spy).toBeTruthy()
  })
})