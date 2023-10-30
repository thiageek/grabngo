import { Product } from './product'

describe('Product', () => {
  it('should be created product', () => {
    const spy = Product.create({
      name: 'Product Name',
      price: 14.99,
      description: 'Product description',
    })

    expect(spy).toBeTruthy()
  })
})
