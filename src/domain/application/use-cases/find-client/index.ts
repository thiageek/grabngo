import { Client } from '@/domain/enterprise/entities/client'
import { ClientRepository } from '@/domain/application/repositories/client-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'

@Injectable()
export class FindClient {
  constructor(private readonly repository: ClientRepository) {}

  async execute(filter: string): Promise<Client | null> {
    try {
      const client = await this.repository.find(filter)
      if (!client) throw new ResourceNotFound('Client not found')
      return client
    } catch (error: any) {
      if (error instanceof ResourceNotFound) throw error
      throw new Error(error)
    }
  }
}
