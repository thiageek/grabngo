import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductMapper } from '@/infra/app/repositories/prisma/mappers/product-mapper'
import { ProductRepository } from '@/domain/application/repositories/product-repository'

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(data: Product): Promise<void> {
    try {
      const raw = ProductMapper.toPrisma(data)
      await this.prisma.product.upsert({
        where: { id: raw.id.toString() },
        create: {
          id: raw.id,
          name: raw.name,
          price: raw.price,
          description: raw.description,
          categories: {
            create: raw.categories?.map((categoryName) => ({
              category: {
                connectOrCreate: {
                  where: {
                    name: categoryName,
                  },
                  create: {
                    name: categoryName,
                  },
                },
              },
            })),
          },
        },
        update: {
          categories: {
            create: raw.categories?.map((categoryName) => ({
              category: {
                connectOrCreate: {
                  where: {
                    name: categoryName,
                  },
                  create: {
                    name: categoryName,
                  },
                },
              },
            })),
            deleteMany: {
              productId: raw.id.toString(),
            },
          },
          description: raw.description,
          name: raw.name,
          price: raw.price,
        },
      })
    } catch (e) {
      throw new Error(`failed to save product: ${e}`)
    }
  }
  async find(filter: string): Promise<Product | null> {
    const raw = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: filter }, { name: filter }],
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    })

    return raw ? ProductMapper.toDomain(raw) : null
  }

  async delete(data: Product): Promise<void> {
    try {
      const raw = ProductMapper.toPrisma(data)
      await this.prisma.product.delete({
        where: {
          id: raw.id,
        },
      })
    } catch (e) {
      throw new Error(`failed to delete product: ${e}`)
    }
  }

  async fetch(params: PaginationParams): Promise<Product[]> {
    const raw = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: params.query,
            },
          },
          {
            description: {
              contains: params.query,
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: params.query,
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    })

    return raw.map((p) => ProductMapper.toDomain(p))
  }
}
