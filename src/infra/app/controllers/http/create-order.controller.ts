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
import { CreateOrder } from '@/domain/application/use-cases/create-order'
import { OrderPresenter } from '../presenters/order-presenter'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'

const createOrderBodySchema = z.object({
  clientId: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      observation: z.string().optional(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)
type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@ApiTags('Order')
@Controller('order')
export class CreateOrderController {
  logger = new Logger(CreateOrderController.name)
  constructor(private readonly createOrder: CreateOrder) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clientId: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number', minimum: 1 },
              observation: { type: 'string' },
            },
          },
        },
        status: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async handler(@Body(bodyValidationPipe) body: CreateOrderBodySchema) {
    try {
      this.logger.log(`New request received path /order`)
      const { clientId, items } = body
      const { order } = await this.createOrder.execute({ clientId, items })
      return OrderPresenter.toHttp(order)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
