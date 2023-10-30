import { UserRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/enterprise/entities/user'

export class MockUserRepository implements UserRepository {
  userList: User[] = []

  async save(data: User): Promise<void> {
    this.userList.push(data)
  }

  async remove(id: string): Promise<void> {
    const index = this.userList.findIndex((user) => user.id.toString() === id)
    this.userList.splice(index, 1)
  }
  async findUser(filter: string): Promise<User | null> {
    const result = await this.userList.find(
      (user) => user.id.toString() == filter || user.login == filter,
    )

    return result ?? null
  }
}
