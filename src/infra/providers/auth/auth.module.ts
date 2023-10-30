import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { JwtModule } from '@nestjs/jwt'
import { SigIn } from './sig-in'
import { JwtStrategy } from './strategy'
import { DataModule } from '../database/database.module'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrismaUserRepository } from '@/infra/app/repositories/prisma/prisma-user-repository'

@Module({
  imports: [JwtModule.register({}), EnvModule, DataModule],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    SigIn,
    JwtStrategy,
  ],
  exports: [UserRepository, SigIn],
})
export class AuthModule {}
