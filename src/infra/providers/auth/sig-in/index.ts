import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'
import { ConfigService } from '@nestjs/config'
import { UserRepository } from '../../../../domain/application/repositories/user-repository'

export interface Input {
  readonly login: string
  readonly password: string
}

export interface Output {
  access_token: string
}

@Injectable()
export class SigIn {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async execute({ login, password }: Input): Promise<Output> {
    const user = await this.repository.findUser(login)
    if (!user) throw new ForbiddenException('Credentials incorrect')
    const pwMatches = await argon.verify(user.password, password)
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect')

    const payload = {
      sub: user.id.toString(),
      login: user.login,
      name: user.name,
      enabled: user.enabled,
    }
    const secret = this.config.get('JWT_SECRET')
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    })
    return {
      access_token: token,
    }
  }
}
