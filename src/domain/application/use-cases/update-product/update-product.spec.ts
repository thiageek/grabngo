import { UpdateProduct } from './index'
import { MockProductRepository } from '@test/repositories/mock-product-repository'
import { Product } from '@/domain/enterprise/entities/product'

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
      categories: ['Category 1'],
    })
    repository.mockProducts.push(product)
  })

  it('Should be able to update a product', async () => {
    const updatedProduct = {
      id: product.id.toString(),
      name: 'Product New Name',
      price: 42,
      description: 'Product new description',
      categories: ['Category 2', 'Category 3'],
    }

    await sut.execute(updatedProduct)

    const spy = await repository.fetch({ page: 1, query: 'Product New Name' })
    expect(spy).toHaveLength(1)
    expect(spy[0]).toHaveProperty('props', {
      description: updatedProduct.description,
      name: updatedProduct.name,
      price: updatedProduct.price,
      categories: updatedProduct.categories,
    })
  })

  it('Should throw an error for not found product update attempt', async () => {
    expect(async () => {
      return await sut.execute({ id: 'invalid-id' })
    }).rejects.toThrow('product not found')
  })
})
