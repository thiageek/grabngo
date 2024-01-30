import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderStatusProps {
  name: string
  description: string
}

export class OrderStatus extends Entity<OrderStatusProps> {
  static create(props: OrderStatusProps, id?: UniqueEntityId) {
    return new OrderStatus(
      {
        ...props,
      },
      id,
    )
  }
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }
}
