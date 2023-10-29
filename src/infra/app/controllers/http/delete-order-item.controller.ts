import {
  Controller,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import { OrderPresenter } from '../presenters/order-presenter'
import { DeleteOrderItem } from '@/domain/application/use-cases/delete-order-item'
import { NotAllowed } from '@/core/errors/not-allowed.error'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Order')
@Controller('order/:orderId/item/:id')
export class DeleteOrderItemController {
  logger = new Logger(DeleteOrderItemController.name)
  constructor(private readonly deleteOrderItem: DeleteOrderItem) {}

  @ApiParam({ name: 'orderId', description: 'Order id' })
  @ApiParam({ name: 'id', description: 'Order item id' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Delete()
  async handler(@Param('orderId') orderId: string, @Param('id') id: string) {
    try {
      this.logger.log(`New request received path order/:orderId/item/:id`)

      const { order } = await this.deleteOrderItem.execute({
        orderId,
        itemId: id,
      })
      return OrderPresenter.toHttp(order)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)

      if (error instanceof NotAllowed)
        throw new ForbiddenException(error.message)

      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
