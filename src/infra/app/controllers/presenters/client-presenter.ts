import { Client } from '@/domain/enterprise/entities/client'

export class ClientPresenter {
  static toHttp(client: Client) {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      cpf: client.cpf,
    }
  }
}
