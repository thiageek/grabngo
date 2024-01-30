import {
  Prisma,
  Order as PrismaOrder,
  Item as PrismaOrderItem,
  OrderStatus as PrismaOrderStatus,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItemMapper } from './order-item-mapper'
import { OrderStatusMapper } from '@/infra/app/repositories/prisma/mappers/order-status-mapper'

type raw = {
  order: PrismaOrder
  items: PrismaOrderItem[]
  status: PrismaOrderStatus
}

export class OrderMapper {
  static toDomain(data: raw) {
    return Order.create(
      {
        clientId: data.order.clientId
          ? new UniqueEntityId(data.order.clientId)
          : null,
        items: data.items.map((i) => OrderItemMapper.toDomain(i)),
        status: OrderStatusMapper.toDomain(data.status),
        orderNumber: data.order.orderNumber,
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
      statusId: data.status.id.toString(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
}
