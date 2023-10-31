import { ClientRepository } from '@/domain/application/repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'

export class MockClientRepository implements ClientRepository {
  mockClients: Client[] = []
  async find(filter: string): Promise<Client | null> {
    const result = this.mockClients.find(
      (f) =>
        f.id.toString() === filter ||
        f.cpf === filter ||
        f.name === filter ||
        f.email === filter,
    )
    return result ?? null
  }
  async save(data: Client) {
    this.mockClients.push(data)
  }
}
