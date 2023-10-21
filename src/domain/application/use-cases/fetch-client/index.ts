import { Client } from '@/domain/enterprise/entities/client'
import { ClientRepository } from '../../repositories/client-repository'

export interface FetchClientInput {
  cpf: string
}

export interface FetchClientOutput {
  client: Client
}

export class FetchClient {
  constructor(private readonly repository: ClientRepository) {}
  async execute({ cpf }: FetchClientInput) {
    const client = await this.repository.find(cpf)
    if (!client) throw new Error('Client not found')
    return { client }
  }
}
