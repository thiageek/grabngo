import { Injectable } from '@nestjs/common'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductRepository } from '@/domain/application/repositories/product-repository'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'

export interface InputCreateProduct {
  name: string
  price: number
  description: string
  categories?: string[]
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
    categories,
  }: InputCreateProduct): Promise<OutputCreateProduct> {
    const productInput = Product.create({
      name,
      price,
      description,
      categories,
    })

    const productNameExist = await this.repository.find(productInput.name)
    if (productNameExist)
      throw new ResourceAlreadyExists('Product already exists')

    const product = Product.create({
      name: productInput.name,
      price: productInput.price,
      description: productInput.description,
      categories: productInput.categories,
    })

    try {
      await this.repository.save(product)
      return { product }
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
