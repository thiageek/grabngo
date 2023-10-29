import { Injectable } from '@nestjs/common'
import * as argon from 'argon2'
import { User } from '../../../enterprise/entities/user'
import { UserRepository } from '../../repositories/user-repository'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import { Profile } from '@/domain/enterprise/entities/value-objects/profile'

export interface Input {
  name: string
  login: string
  password: string
  profile: number
}

export interface Output {
  user: User
}

@Injectable()
export class CreateUser {
  constructor(private readonly repository: UserRepository) {}
  async execute({ name, login, password, profile }: Input): Promise<Output> {
    const userExist = await this.repository.findUser(`${login}@grabngo`)
    if (userExist) throw new ResourceAlreadyExists()

    const hashPassword = await argon.hash(password)
    const user = User.create({
      name,
      login,
      password: hashPassword,
      profile: new Profile(profile),
      updatedAt: undefined,
    })
    await this.repository.save(user)

    return { user }
  }
}
