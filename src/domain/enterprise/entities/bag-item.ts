import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/helpers/optional'

export interface BagItemProps {
  productId: UniqueEntityId
  quantity: number
  observation?: string
  createdAt: Date
  updatedAt?: Date
}
export class BagItem extends Entity<BagItemProps> {
  static create(
    props: Optional<BagItemProps, 'quantity' | 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new BagItem(
      {
        ...props,
        quantity: props.quantity ?? 1,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get productId() {
    return this.props.productId
  }

  get quantity() {
    return this.props.quantity
  }

  set quantity(value: number) {
    this.props.quantity = value
    this.touch()
  }

  get observation(): string | undefined {
    return this.props.observation
  }

  set observation(value: string | undefined) {
    this.props.observation = value
    this.touch()
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
