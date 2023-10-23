import { Injectable } from '@nestjs/common'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductRepository } from '@/domain/application/repositories/product-repository'

export interface InputProduct {
  name: string
  price: number
  description: string
}

export interface OutputProduct {
  product: Product
}

@Injectable()
export class CreateProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute({
    name,
    price,
    description,
  }: InputProduct): Promise<OutputProduct> {
    const product = Product.create({
      name,
      price,
      description,
    })

    await this.repository.save(product)

    return { product }
  }
}