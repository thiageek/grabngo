import { Injectable } from '@nestjs/common'
import { ClientRepository } from '../../repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'

export interface InputCreate {
  name: string
  email: string
  cpf: string
}

export interface OutputCreate {
  client: Client
}

@Injectable()
export class CreateClient {
  constructor(private readonly repository: ClientRepository) {}
  async execute({ name, email, cpf }: InputCreate): Promise<OutputCreate> {
    const client = Client.create({
      name,
      cpf,
      email,
    })

    await this.repository.save(client)

    return { client }
  }
}
