import { UserRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/enterprise/entities/user'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { UserMapper } from './mappers/user-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(data: User): Promise<void> {
    const raw = UserMapper.toPrisma(data)
    try {
      await this.prisma.user.upsert({
        where: { id: raw.id },
        create: raw,
        update: raw,
      })
    } catch (e) {
      throw new Error(`failed to save User: ${e}`)
    }
  }
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      })
    } catch (e) {
      throw new Error(`failed to remove User: ${e}`)
    }
  }
  async findUser(filter: string): Promise<User | null> {
    const raw = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: filter }, { login: filter }],
      },
    })

    return raw ? UserMapper.toDomain(raw) : null
  }
}
