import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { Controller, Logger, Query, Get } from '@nestjs/common'
import { z } from 'zod'
import { OrderPresenter } from '../presenters/order-presenter'
import { FetchOrder } from '@/domain/application/use-cases/fetch-order'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Order')
@Controller('order')
export class FetchOrdersController {
  logger = new Logger(FetchOrdersController.name)
  constructor(private readonly fetchOrders: FetchOrder) {}

  @ApiQuery({ name: 'page', description: 'Page' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    this.logger.log(`New request received path /order`)
    const { orders } = await this.fetchOrders.execute({ page })
    return orders.map((i) => OrderPresenter.toHttp(i))
  }
}
