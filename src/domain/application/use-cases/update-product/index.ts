import { Injectable } from '@nestjs/common'
import { isEmpty, isNil } from "@nestjs/common/utils/shared.utils"
import { ProductRepository } from '@/domain/application/repositories/product-repository'
import { Product } from '@/domain/enterprise/entities/product'

export interface InputUpdateProduct {
  id: string
  name?: string
  price?: number
  description?: string
}

export interface OutputUpdateProduct {
  product: Product
}

@Injectable()
export class UpdateProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute({
    id,
    name,
    price,
    description,
  }: InputUpdateProduct): Promise<OutputUpdateProduct> {
    const product = await this.repository.find(id)

    if (isNil(product)) throw new Error('product not found')

    const updatedProduct = Product.create(
      {
        name: name ?? product.name,
        price: price ?? product.price,
        description: description ?? product.description,
      },
      product!.id,
    )

    await this.repository.save(updatedProduct)

    return { product: updatedProduct }
  }
}
