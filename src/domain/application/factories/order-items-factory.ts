import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/enterprise/entities/order-item'

type input = {
  id?: string
  productId: string
  quantity: number
  observation?: string
}
/**
 * Create list of order items
 */
export function orderItemsFactory(input: input[]): OrderItem[] {
  return input.map((i) =>
    OrderItem.create(
      {
        productId: new UniqueEntityId(i.productId),
        quantity: i.quantity,
        observation: i.observation,
      },
      i.id ? new UniqueEntityId(i.id) : undefined,
    ),
  )
}
