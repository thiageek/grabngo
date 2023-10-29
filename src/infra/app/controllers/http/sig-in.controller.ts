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
import { SigIn } from '@/infra/providers/auth/sig-in'

const sigInBodySchema = z.object({
  login: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(sigInBodySchema)

type SigUpBodySchema = z.infer<typeof sigInBodySchema>

@ApiTags('Auth')
@Controller('auth/sig-in')
export class SigInController {
  logger = new Logger(SigInController.name)
  constructor(private readonly createUser: SigIn) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        login: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async handler(@Body(bodyValidationPipe) body: SigUpBodySchema) {
    try {
      this.logger.log(`New request received path auth/sig-in`)
      const { login, password } = body
      const { access_token } = await this.createUser.execute({
        login,
        password,
      })
      return { token: access_token }
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
