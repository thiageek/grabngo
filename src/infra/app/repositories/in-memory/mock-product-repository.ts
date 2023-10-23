import { ProductRepository } from '@/domain/application/repositories/product-repository'
import { Product } from '@/domain/enterprise/entities/product'

export class MockProductRepository implements ProductRepository {
  mockProducts: Product[] = []
  async find(filter: string): Promise<Product[] | null> {
    const result = this.mockProducts.filter(
      (f) => f.id.toString() === filter || f.name === filter,
    )
    return result ?? null
  }
  async save(data: Product): Promise<void> {
    this.mockProducts.push(data)
  }
  async delete(data: Product): Promise<void> {
    const index = this.mockProducts.indexOf(data)
    if (index !== -1) {
      this.mockProducts.splice(index, 1)
    }
  }
}
