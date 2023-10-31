import { MockProductRepository } from '@test/repositories/mock-product-repository'
import { Product } from '@/domain/enterprise/entities/product'
import { FetchProducts } from '@/domain/application/use-cases/fetch-products/index'

let sut: FetchProducts
let repository: MockProductRepository
let product: Product
describe('Find products', () => {
  beforeEach(() => {
    repository = new MockProductRepository()
    sut = new FetchProducts(repository)
    product = Product.create({
      name: 'Product #1',
      price: 14.99,
      description: 'Product #1 description',
      categories: ['Category 1'],
    })
    repository.mockProducts.push(product)
    product = Product.create({
      name: 'Product #2',
      price: 1.99,
      description: 'Product #2 description',
      categories: ['Category 2'],
    })
    repository.mockProducts.push(product)
    product = Product.create({
      name: 'Product #3',
      price: 3.99,
      description: 'Product #3 description',
      categories: ['Category 1', 'Category 2'],
    })
    repository.mockProducts.push(product)
  })

  it('Should be able to find products by name', async () => {
    const params = { page: 1, query: 'Product #1' }

    const got = await sut.execute(params)

    expect(got).toHaveLength(1)
  })

  it('Should be able to find products by description', async () => {
    const params = { page: 1, query: 'Product #2 description' }

    const got = await sut.execute(params)

    expect(got).toHaveLength(1)
  })

  it('Should be able to find products by category', async () => {
    const params = { page: 1, query: 'Category 1' }

    const got = await sut.execute(params)

    expect(got).toHaveLength(2)
  })
})
