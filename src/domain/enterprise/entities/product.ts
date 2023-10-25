import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface ProductProps {
  name: string
  price: number
  description: string
}

export class Product extends Entity<ProductProps> {
  static create(props: ProductProps, id?: UniqueEntityId) {
    return new Product(
      {
        ...props,
      },
      id,
    )
  }
  get name() {
    return this.props.name
  }

  get price() {
    return this.props.price
  }

  get description() {
    return this.props.description
  }
}
