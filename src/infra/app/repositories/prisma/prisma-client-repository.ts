import { ClientRepository } from '@/domain/application/repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { PrismaService } from '@/infra/providers/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ClientMapper } from './mappers/client-mapper'

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(data: Client): Promise<void> {
    const raw = ClientMapper.toPrisma(data)
    await this.prisma.client.create({
      data: raw,
    })
  }
  async find(filter: string): Promise<Client | null> {
    const raw = await this.prisma.client.findFirst({
      where: {
        OR: [
          { id: filter },
          { cpf: filter },
          { email: filter },
          { name: filter },
        ],
      },
    })

    return raw ? ClientMapper.toDomain(raw) : null
  }
}
