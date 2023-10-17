import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface ClientProps {
  name: string
  email: string
  cpf: string
}
export class Client extends Entity<ClientProps> {
  static create(props: ClientProps, id?: UniqueEntityId) {
    return new Client(
      {
        ...props,
      },
      id,
    )
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }
  get cpf() {
    return this.props.cpf
  }
}
