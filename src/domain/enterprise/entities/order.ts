import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/helpers/optional'
import { Status } from './value-objects/status'
import { OrderItem } from './order-item'

export interface OrderProps {
  clientId?: UniqueEntityId
  items: OrderItem[]
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

  get items() {
    return this.props.items
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  addItem(values: OrderItem[]) {
    values.forEach((value) => this.props.items.push(value))
    this.touch()
  }

  updateItem(value: OrderItem) {
    const index = this.props.items.findIndex((i) => i.id.equals(value.id))
    this.props.items[index] = value
    this.touch()
  }

  removeItem(value: OrderItem) {
    const index = this.props.items.findIndex((i) => i.id.equals(value.id))
    this.props.items.splice(index, 1)
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
