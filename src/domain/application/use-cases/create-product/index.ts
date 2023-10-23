import { Injectable } from '@nestjs/common'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductRepository } from '@/domain/application/repositories/product-repository'

export interface InputCreateProduct {
  name: string
  price: number
  description: string
}

export interface OutputCreateProduct {
  product: Product
}

@Injectable()
export class CreateProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute({
    name,
    price,
    description,
  }: InputCreateProduct): Promise<OutputCreateProduct> {
    const product = Product.create({
      name,
      price,
      description,
    })

    await this.repository.save(product)

    return { product }
  }
}
