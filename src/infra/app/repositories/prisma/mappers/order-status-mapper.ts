import { OrderStatus as raw } from '@prisma/client'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class OrderStatusMapper {
  static toDomain(data: raw) {
    return OrderStatus.create(
      {
        name: data.name,
        description: data.description,
      },
      new UniqueEntityId(data.id),
    )
  }
}
