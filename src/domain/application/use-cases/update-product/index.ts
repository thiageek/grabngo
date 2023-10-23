import { Injectable } from '@nestjs/common'
import { ProductRepository } from '@/domain/application/repositories/product-repository'
import { Product } from '@/domain/enterprise/entities/product'

export interface InputUpdateProduct {
  id: string
  name: string
  price: number
  description: string
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
    const products = await this.repository.find(id)

    if (products?.length !== 1) throw new Error('product not found')

    const product = Product.create({ name, price, description }, products[0].id)

    await this.repository.save(product)

    return { product }
  }
}
