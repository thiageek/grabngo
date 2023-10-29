import { CreateClient } from '@/domain/application/use-cases/create-client'
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
import { ClientPresenter } from '../presenters/client-presenter'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'

const createClientBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  cpf: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createClientBodySchema)

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>

@ApiTags('Client')
@Controller('client')
export class CreateClientController {
  logger = new Logger(CreateClientController.name)
  constructor(private readonly createClient: CreateClient) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        cpf: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async handler(@Body(bodyValidationPipe) body: CreateClientBodySchema) {
    try {
      this.logger.log(`New request received path /client`)
      const { name, cpf, email } = body
      const { client } = await this.createClient.execute({ name, cpf, email })
      return ClientPresenter.toHttp(client)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
