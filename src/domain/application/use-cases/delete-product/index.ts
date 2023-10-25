import { Injectable } from '@nestjs/common'
import { ProductRepository } from '@/domain/application/repositories/product-repository'
import { isNil } from "@nestjs/common/utils/shared.utils"

export interface InputDeleteProduct {
  id: string
}

@Injectable()
export class DeleteProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute({ id }: InputDeleteProduct): Promise<void> {
    const product = await this.repository.find(id)

    if (isNil(product)) throw new Error('product not found')

    await this.repository.delete(product)
  }
}
