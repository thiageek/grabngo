import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/helpers/optional'
import { Status } from './value-objects/status'

export interface OrderProps {
  clientId?: UniqueEntityId
  bagId?: UniqueEntityId
  status: Status
  createdAt: Date
  updatedAt?: Date
}
export class Order extends Entity<OrderProps> {
  static create(
    props: Optional<OrderProps, 'status' | 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new Order(
      {
        ...props,
        status: props.status ?? new Status('done'),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get status() {
    return this.props.status
  }

  set status(value: Status) {
    this.props.status = value
    this.touch()
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
