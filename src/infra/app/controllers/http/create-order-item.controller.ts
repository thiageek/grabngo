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
import { OrderPresenter } from '../presenters/order-presenter'
import { AddOrderItem } from '@/domain/application/use-cases/add-order-item'

const createOrderItemBodySchema = z.object({
  orderId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      observation: z.string().optional(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderItemBodySchema)
type CreateOrderItemBodySchema = z.infer<typeof createOrderItemBodySchema>

@Controller('order/item')
export class CreateOrderItemController {
  logger = new Logger(CreateOrderItemController.name)
  constructor(private readonly addOrderItem: AddOrderItem) {}

  @Post()
  async handler(@Body(bodyValidationPipe) body: CreateOrderItemBodySchema) {
    try {
      this.logger.log(`New request received path /order/item`)
      const { orderId, items } = body
      const { order } = await this.addOrderItem.execute({ orderId, items })
      return OrderPresenter.toHttp(order)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
