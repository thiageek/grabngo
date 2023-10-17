import { Client } from '../../enterprise/entities/client'

export abstract class ClientRepository {
  abstract save(data: Client): Promise<void>
  abstract find(filter: string): Promise<Client | null>
}
