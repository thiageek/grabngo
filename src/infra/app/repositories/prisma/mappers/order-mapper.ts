import {
  Prisma,
  Order as PrismaOrder,
  Item as PrismaOrderItem,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { Status } from '@/domain/enterprise/entities/value-objects/status'
import { OrderItemMapper } from './order-item-mapper'

type raw = {
  order: PrismaOrder
  items: PrismaOrderItem[]
}

export class OrderMapper {
  static toDomain(data: raw) {
    return Order.create(
      {
        clientId: data.order.clientId
          ? new UniqueEntityId(data.order.clientId)
          : null,
        items: data.items.map((i) => OrderItemMapper.toDomain(i)),
        status: new Status(data.order.status),
        createdAt: data.order.createdAt,
        updatedAt: data.order.updatedAt,
      },
      new UniqueEntityId(data.order.id),
    )
  }

  static toPrisma(data: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: data.id.toString(),
      orderNumber: data.orderNumber,
      clientId: data.clientId?.toString(),
      status: data.status.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
}
