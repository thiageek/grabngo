import { User } from '@/domain/enterprise/entities/user'

export class UserPresenter {
  static toHttp(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.login,
    }
  }
}
