import {
  Controller,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  Param,
  Get,
} from '@nestjs/common'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import { Checkout } from '@/domain/application/use-cases/checkout'
import { CheckoutPresenter } from '../presenters/checkout-presenter'

@Controller('order/:id/checkout')
export class CheckoutController {
  logger = new Logger(CheckoutController.name)
  constructor(private readonly checkout: Checkout) {}

  @Get()
  async handler(@Param('id') id: string) {
    try {
      this.logger.log(`New request received path order/:id/checkout`)

      const { order, products, total } = await this.checkout.execute({
        orderId: id,
      })
      return CheckoutPresenter.toHttp(order, products, total)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)

      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
