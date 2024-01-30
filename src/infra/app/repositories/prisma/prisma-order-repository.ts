import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderMapper } from './mappers/order-mapper'
import { OrderItemMapper } from './mappers/order-item-mapper'
import { OrderStatus } from '@/domain/enterprise/entities/order-status'
import { OrderStatusNameEnum, PaymentTransactionStatusEnum } from "@prisma/client"
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'
import { PaymentTransaction } from '@/domain/enterprise/entities/payment-transaction'
import { PaymentTransactionMapper } from '@/infra/app/repositories/prisma/mappers/payment-transaction-mapper'

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
        status: true,
      },
    })

    if (!raw?.status) {
      throw new ResourceNotFound(`Order status not found`)
    }

    return raw
      ? OrderMapper.toDomain({
          order: raw,
          items: raw.Item,
          status: raw.status,
        })
      : null
  }
  async fetchOrder({ page }: PaginationParams): Promise<Order[]> {
    const raws = await this.prisma.order.findMany({
      orderBy: [
        {
          status: {
            sequenceOrder: 'desc',
          },
        },
        {
          createdAt: 'desc',
        },
      ],
      include: {
        Item: true,
        status: true,
      },
      where: {
        status: {
          name: {
            notIn: [
              OrderStatusNameEnum.EXPIRED,
              OrderStatusNameEnum.CANCELED,
              OrderStatusNameEnum.DISCARDED,
              OrderStatusNameEnum.DELIVERED,
            ],
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return raws.map((i) => {
      if (!i.status) {
        throw new ResourceNotFound(`Order status not found`)
      }

      return OrderMapper.toDomain({
        order: i,
        items: i.Item,
        status: i.status,
      })
    })
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

  async findStatus(filter: string): Promise<OrderStatus> {
    const orderStatus = (OrderStatusNameEnum as any)[
      filter as keyof typeof OrderStatusNameEnum
    ]

    const raw = await this.prisma.orderStatus.findFirst({
      where: { OR: [{ id: filter }, { name: orderStatus }] },
    })

    if (!raw) {
      throw new ResourceNotFound(`OrderStatus not found`)
    }

    return OrderStatus.create(
      {
        name: raw.name,
        description: raw.description,
      },
      new UniqueEntityId(raw.id),
    )
  }

  async addPaymentTransaction(data: PaymentTransaction): Promise<void> {
    try {
      const raw = PaymentTransactionMapper.toPrisma(data)
      await this.prisma.paymentTransaction.create({
        data: raw,
      })
    } catch (e) {
      throw new Error(`failed to add payment transaction: ${e}`)
    }
  }

  async findPaymentStatus(
    orderId: string,
  ): Promise<PaymentTransactionStatusEnum | null> {
    const raw = await this.prisma.paymentTransaction.findFirst({
      where: { orderId },
      select: {
        transactionStatus: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return raw?.transactionStatus ?? null
  }
}
