import { Optional } from '@prisma/client/runtime/library'
import { Profile } from './value-objects/profile'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface UserProps {
  name: string
  login: string
  password: string
  profile: Profile
  enabled: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  static create(
    props: Optional<UserProps, 'createdAt' | 'enabled'>,
    id?: UniqueEntityId,
  ) {
    return new User(
      {
        ...props,
        login: `${props.login}@grabngo`,
        enabled: props.enabled ?? true,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get login() {
    return this.props.login
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get profile() {
    return this.props.profile
  }

  set profile(profile: Profile) {
    this.props.profile = profile
    this.touch()
  }

  get enabled() {
    return this.props.enabled
  }
  set enabled(enabled: boolean) {
    this.props.enabled = enabled
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
