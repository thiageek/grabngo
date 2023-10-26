import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/helpers/optional'
import { BagItem } from './bag-item'

export interface BagProps {
  orderId: UniqueEntityId
  items: BagItem[]
  createdAt: Date
  updatedAt?: Date
}
export class Bag extends Entity<BagProps> {
  static create(props: Optional<BagProps, 'createdAt'>, id?: UniqueEntityId) {
    return new Bag(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get orderId() {
    return this.props.orderId
  }

  get items() {
    return this.props.items
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  addItem(values: BagItem[]) {
    values.forEach((value) => this.props.items.push(value))
    this.touch()
  }

  updateItem(value: BagItem) {
    const index = this.props.items.findIndex((i) => i.id.equals(value.id))
    this.props.items[index] = value
    this.touch()
  }

  removeItem(value: BagItem) {
    const index = this.props.items.findIndex((i) => i.id.equals(value.id))
    this.props.items.splice(index, -1)
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
