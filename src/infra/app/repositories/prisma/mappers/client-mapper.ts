import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Client } from '@/domain/enterprise/entities/client'
import { Client as raw } from '@prisma/client'
export class ClientMapper {
  static toDomain(data: raw) {
    return Client.create(
      {
        cpf: data.cpf,
        email: data.email,
        name: data.name,
      },
      new UniqueEntityId(data.id),
    )
  }

  static toPrisma(data: Client) {
    return {
      id: data.id.toString(),
      cpf: data.cpf,
      email: data.email,
      name: data.name,
    }
  }
}
