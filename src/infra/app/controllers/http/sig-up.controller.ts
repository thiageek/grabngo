import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  Post,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateUser } from '@/domain/application/use-cases/create-user'
import { UserPresenter } from '../presenters/user-presenter'

const createUserBodySchema = z.object({
  name: z.string(),
  login: z.string(),
  password: z.string(),
  profile: z.coerce.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@ApiTags('Auth')
@Controller('auth/sig-up')
export class SigUpController {
  logger = new Logger(SigUpController.name)
  constructor(private readonly createUser: CreateUser) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        login: { type: 'string' },
        password: { type: 'string' },
        profile: { type: 'number' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async handler(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    try {
      this.logger.log(`New request received path auth/sig-up`)
      const { name, login, password, profile } = body
      const { user } = await this.createUser.execute({
        name,
        login,
        password,
        profile,
      })
      return UserPresenter.toHttp(user)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
