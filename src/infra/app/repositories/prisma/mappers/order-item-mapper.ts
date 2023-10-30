import { Prisma, Item as raw } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/enterprise/entities/order-item'

export class OrderItemMapper {
  static toDomain(data: raw) {
    return OrderItem.create(
      {
        productId: new UniqueEntityId(data.productId),
        quantity: data.quantity,
        observation: data.observation,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    )
  }

  static toPrisma(
    data: OrderItem,
    orderId: UniqueEntityId,
  ): Prisma.ItemUncheckedCreateInput {
    return {
      id: data.id.toString(),
      orderId: orderId.toString(),
      productId: data.productId.toString(),
      quantity: data.quantity,
      observation: data.observation,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
}
