import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import { OrderPresenter } from '../presenters/order-presenter'
import { UpdateOrder } from '@/domain/application/use-cases/update-order'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { JwtGuard } from '@/infra/providers/auth/guards'

const updateOrderBodySchema = z.object({
  status: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateOrderBodySchema)
type UpdateOrderBodySchema = z.infer<typeof updateOrderBodySchema>

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('order/:id')
export class UpdateOrderController {
  logger = new Logger(UpdateOrderController.name)
  constructor(private readonly updateOrder: UpdateOrder) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Order id' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Put()
  async handler(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateOrderBodySchema,
  ) {
    try {
      this.logger.log(`New request received path /order`)
      const { status } = body
      const { order } = await this.updateOrder.execute({ id, status })
      return OrderPresenter.toHttp(order)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
