import { Injectable } from '@nestjs/common'
import { ClientRepository } from '../../repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'

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
    const [clientCpfExist, clientEmailExist] = await Promise.all([
      this.repository.find(cpf),
      this.repository.find(email),
    ])
    if (clientCpfExist || clientEmailExist)
      throw new ResourceAlreadyExists('Client already exists')
    const client = Client.create({
      name,
      cpf,
      email,
    })

    try {
      await this.repository.save(client)
      return { client }
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
