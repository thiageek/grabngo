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
    await sut.execute({
      name: 'Product Name',
      price: 14.99,
      description: 'Product description',
    })

    const spy = await repository.find('Product Name')
    expect(spy).toBeTruthy()
  })
})
