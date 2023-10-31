import { CreateProduct } from './index'
import { MockProductRepository } from '@/infra/app/repositories/in-memory/mock-product-repository'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'

let sut: CreateProduct
let mockProductRepository: MockProductRepository
describe('Create product', () => {
  beforeEach(() => {
    mockProductRepository = new MockProductRepository()
    sut = new CreateProduct(mockProductRepository)
  })

  it('Should be able to create a product', async () => {
    const product = {
      name: 'Product Name',
      price: 14.99,
      description: 'Product description',
      categories: ['Category 1', 'Category 2'],
    }

    await sut.execute(product)

    const spy = await mockProductRepository.fetch({
      page: 1,
      query: 'Product Name',
    })
    expect(spy).toHaveLength(1)
    expect(spy[0]).toHaveProperty('props', {
      name: product.name,
      price: product.price,
      description: product.description,
      categories: product.categories,
    })
  })

  it('Should be able to throw an error when product already exists', async () => {
    const product = {
      name: 'Product Name',
      price: 14.99,
      description: 'Product description',
      categories: [],
    }

    await sut.execute(product)

    expect(async () => {
      return await sut.execute(product)
    }).rejects.toThrow(ResourceAlreadyExists)
  })
})
