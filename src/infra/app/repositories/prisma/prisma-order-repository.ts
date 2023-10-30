import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderMapper } from './mappers/order-mapper'
import { OrderItemMapper } from './mappers/order-item-mapper'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveOrder(data: Order): Promise<void> {
    try {
      const raw = OrderMapper.toPrisma(data)
      await this.prisma.order.upsert({
        where: { id: raw.id },
        create: raw,
        update: raw,
      })

      const rawItems = data.items.map((i) =>
        OrderItemMapper.toPrisma(i, data.id),
      )

      for (const rawItem of rawItems) {
        await this.prisma.item.upsert({
          where: { id: rawItem.id },
          create: rawItem,
          update: rawItem,
        })
      }
    } catch (e) {
      throw new Error(`failed to save Order: ${e}`)
    }
  }
  async findOrder(filter: string): Promise<Order | null> {
    const raw = await this.prisma.order.findFirst({
      where: { id: filter },
      include: {
        Item: true,
      },
    })

    return raw
      ? OrderMapper.toDomain({
          order: raw,
          items: raw.Item,
        })
      : null
  }
  async fetchOrder({ page }: PaginationParams): Promise<Order[]> {
    const raws = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Item: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return raws.map((i) =>
      OrderMapper.toDomain({
        order: i,
        items: i.Item,
      }),
    )
  }

  async removeItem(id: string): Promise<void> {
    try {
      await this.prisma.item.delete({
        where: { id },
      })
    } catch (e) {
      throw new Error(`failed to remove item: ${e}`)
    }
  }
}
