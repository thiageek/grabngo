import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductRepository } from '@/domain/application/repositories/product-repository'

@Injectable()
export class FetchProducts {
  constructor(private readonly repository: ProductRepository) {}

  async execute(params: PaginationParams): Promise<Product[]> {
    return await this.repository.fetch(params)
  }
}
