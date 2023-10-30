import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/helpers/optional'

export interface OrderItemProps {
  productId: UniqueEntityId
  quantity: number
  observation?: string | null
  createdAt: Date
  updatedAt?: Date | null
}
export class OrderItem extends Entity<OrderItemProps> {
  static create(
    props: Optional<OrderItemProps, 'quantity' | 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new OrderItem(
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

  get observation(): string | undefined | null {
    return this.props.observation
  }

  set observation(value: string | undefined) {
    this.props.observation = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
