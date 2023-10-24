import { PaginationParams } from '@/core/repositories/pagination-params'
import { Product } from '@/domain/enterprise/entities/product'

export abstract class ProductRepository {
  abstract save(data: Product): Promise<void>
  abstract find(filter: string): Promise<Product | null>
  abstract delete(data: Product): Promise<void>
  abstract fetch(params: PaginationParams): Promise<Product[]>
}
