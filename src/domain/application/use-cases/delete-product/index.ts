import { Injectable } from '@nestjs/common'
import { ProductRepository } from '@/domain/application/repositories/product-repository'

export interface InputDeleteProduct {
  id: string
}

@Injectable()
export class DeleteProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute({ id }: InputDeleteProduct): Promise<void> {
    const products = await this.repository.find(id)

    if (products?.length !== 1) throw new Error('product not found')

    await this.repository.delete(products[0])
  }
}
