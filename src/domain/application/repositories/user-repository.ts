import { User } from '@/domain/enterprise/entities/user'

export abstract class UserRepository {
  abstract save(data: User): Promise<void>
  abstract remove(id: string): Promise<void>
  abstract findUser(filter: string): Promise<User | null>
}
