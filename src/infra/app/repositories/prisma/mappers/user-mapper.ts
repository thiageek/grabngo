import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/enterprise/entities/user'
import { Profile } from '@/domain/enterprise/entities/value-objects/profile'
import { Prisma, User as raw } from '@prisma/client'

export class UserMapper {
  static toDomain(data: raw) {
    return User.create(
      {
        login: data.login,
        name: data.name,
        password: data.password,
        profile: new Profile(data.profile),
        enabled: data.enabled,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    )
  }
  static toPrisma(data: User): Prisma.UserUncheckedCreateInput {
    return {
      id: data.id.toString(),
      login: data.login,
      name: data.name,
      password: data.password,
      profile: data.profile.value,
      enabled: data.enabled,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
}
