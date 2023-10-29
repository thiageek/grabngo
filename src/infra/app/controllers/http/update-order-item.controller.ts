import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  Put,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import { OrderPresenter } from '../presenters/order-presenter'
import { UpdateOrderItem } from '@/domain/application/use-cases/update-order-item'

const updateOrderItemBodySchema = z.object({
  item: z.object({
    productId: z.string(),
    quantity: z.number().optional(),
    observation: z.string().optional(),
  }),
})

const bodyValidationPipe = new ZodValidationPipe(updateOrderItemBodySchema)
type UpdateOrderItemBodySchema = z.infer<typeof updateOrderItemBodySchema>

@Controller('order/:orderId/item/:id')
export class UpdateOrderItemController {
  logger = new Logger(UpdateOrderItemController.name)
  constructor(private readonly updateOrderItem: UpdateOrderItem) {}

  @Put()
  async handler(
    @Param('orderId') orderId: string,
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateOrderItemBodySchema,
  ) {
    try {
      this.logger.log(`New request received path order/:orderId/item/:id`)
      const { item } = body

      const { order } = await this.updateOrderItem.execute({
        orderId,
        item: {
          id,
          ...item,
        },
      })
      return OrderPresenter.toHttp(order)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
