import { CreateProduct } from './index'
import { MockProductRepository } from '@/infra/app/repositories/in-memory/mock-product-repository'

let sut: CreateProduct
let repository: MockProductRepository
describe('Create product', () => {
  beforeEach(() => {
    repository = new MockProductRepository()
    sut = new CreateProduct(repository)
  })

  it('Should be able to create a product', async () => {
    const product = {
      name: 'Product Name',
      price: 14.99,
      description: 'Product description',
    }

    await sut.execute(product)

    const spy = await repository.fetch({ page: 1, query: 'Product Name' })
    expect(spy).toHaveLength(1)
    expect(spy[0]).toHaveProperty('props', product)
  })
})
