import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductMapper } from '@/infra/app/repositories/prisma/mappers/product-mapper'
import { ProductRepository } from '@/domain/application/repositories/product-repository'

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(data: Product): Promise<void> {
    const raw = ProductMapper.toPrisma(data)
    await this.prisma.product.create({
      data: raw,
    })
  }
  async find(filter: string): Promise<Product[] | null> {
    const raw = await this.prisma.product.findMany({
      where: {
        OR: [{ id: filter }, { name: filter }],
      },
    })

    return raw ? raw.map((p) => ProductMapper.toDomain(p)) : null
  }

  async delete(data: Product): Promise<void> {
    const raw = ProductMapper.toPrisma(data)
    await this.prisma.product.delete({
      where: {
        id: raw.id,
      },
    })
  }
}
