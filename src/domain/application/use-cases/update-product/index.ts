import { Injectable } from '@nestjs/common'
import { isNil } from '@nestjs/common/utils/shared.utils'
import { ProductRepository } from '@/domain/application/repositories/product-repository'
import { Product } from '@/domain/enterprise/entities/product'

export interface InputUpdateProduct {
  id: string
  name?: string
  price?: number
  description?: string
  categories?: string[]
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
    categories,
  }: InputUpdateProduct): Promise<OutputUpdateProduct> {
    const product = await this.repository.find(id)

    if (isNil(product)) throw new Error('product not found')

    const updatedProduct = Product.create(
      {
        name: name ?? product.name,
        price: price ?? product.price,
        description: description ?? product.description,
        categories: categories ?? product.categories,
      },
      product!.id,
    )

    try {
      await this.repository.save(updatedProduct)
    } catch (error: any) {
      throw new Error(error)
    }

    return { product: updatedProduct }
  }
}
