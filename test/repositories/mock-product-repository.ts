import { PaginationParams } from '@/core/repositories/pagination-params'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductRepository } from '@/domain/application/repositories/product-repository'

export class MockProductRepository implements ProductRepository {
  mockProducts: Product[] = []
  async find(filter: string): Promise<Product | null> {
    const result = this.mockProducts.find((f) => f.id.toString() === filter || f.name === filter)
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
  async fetch(params: PaginationParams): Promise<Product[]> {
    return this.mockProducts.filter(
      (f) =>
        f.name.includes(params.query ?? '') ||
        f.description.includes(params.query ?? '') ||
        f.categories?.includes(params.query ?? ''),
    )
  }
}
