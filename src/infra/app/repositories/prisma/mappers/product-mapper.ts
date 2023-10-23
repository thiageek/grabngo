import { Product } from '@/domain/enterprise/entities/product'
import { Product as raw } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class ProductMapper {
  static toDomain(data: raw) {
    return Product.create(
      {
        name: data.name,
        price: data.price,
        description: data.description,
      },
      new UniqueEntityId(data.id),
    )
  }

  static toPrisma(data: Product) {
    return {
      id: data.id.toString(),
      name: data.name,
      price: data.price,
      description: data.description,
    }
  }
}
