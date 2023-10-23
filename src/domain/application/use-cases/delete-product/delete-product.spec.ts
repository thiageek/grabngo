import { DeleteProduct } from '@/domain/application/use-cases/delete-product/index'
import { MockProductRepository } from '@/infra/app/repositories/in-memory/mock-product-repository'
import { Product } from '@/domain/enterprise/entities/product'

let sut: DeleteProduct
let repository: MockProductRepository
let product: Product
describe('Delete product', () => {
  beforeEach(() => {
    repository = new MockProductRepository()
    sut = new DeleteProduct(repository)
    product = Product.create({
      name: 'Product Name',
      price: 14.99,
      description: 'Product description',
    })
    repository.mockProducts.push(product)
  })

  it('Should be able to delete a product', async () => {
    await sut.execute({
      id: product.id.toString(),
    })

    const spy = await repository.find('Product Name')
    expect(spy).toHaveLength(0)
  })
})
