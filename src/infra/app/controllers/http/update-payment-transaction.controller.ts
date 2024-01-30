import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreatePaymentTransaction } from '@/domain/application/use-cases/create-payment-transaction'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  PaymentTransactionGatewayEnum,
  PaymentTransactionMethodEnum,
  PaymentTransactionStatusEnum,
} from '@prisma/client'
import { JwtGuard } from '@/infra/providers/auth/guards'
import { PaymentTransactionPresenter } from '@/infra/app/controllers/presenters/payment-transaction-presenter'

const updatePaymentTransactionBodySchema = z.object({
  transactionId: z.string(),
  transactionStatus: z.nativeEnum(PaymentTransactionStatusEnum),
  transactionMethod: z.nativeEnum(PaymentTransactionMethodEnum),
  transactionGateway: z.nativeEnum(PaymentTransactionGatewayEnum),
  transactionDatetime: z.string(),
  amount: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(
  updatePaymentTransactionBodySchema,
)
type UpdatePaymentTransactionBodySchema = z.infer<
  typeof updatePaymentTransactionBodySchema
>

@ApiTags('Webhook')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('webhook-payment/:orderId')
export class UpdatePaymentTransactionController {
  logger = new Logger(UpdatePaymentTransactionController.name)
  constructor(
    private readonly updatePaymentTransaction: CreatePaymentTransaction,
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
        transactionId: { type: 'string' },
        transactionStatus: { type: 'string' },
        transactionMethod: { type: 'string' },
        transactionGateway: { type: 'string' },
        transactionDatetime: { type: 'string' },
        amount: { type: 'number' },
      },
    },
  })
  @ApiParam({ name: 'orderId', description: 'Order id' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async handler(
    @Param('orderId') orderId: string,
    @Body(bodyValidationPipe) body: UpdatePaymentTransactionBodySchema,
  ) {
    try {
      this.logger.log(`New request received path /webhook-payment/:orderId`)

      const { paymentTransaction } =
        await this.updatePaymentTransaction.execute({
          orderId: orderId,
          transactionId: body.transactionId,
          transactionStatus: body.transactionStatus,
          transactionMethod: body.transactionMethod,
          transactionGateway: body.transactionGateway,
          transactionDatetime: new Date(body.transactionDatetime),
          amount: body.amount,
        })

      return PaymentTransactionPresenter.toHttp(paymentTransaction)
    } catch (error: any) {
      if (error instanceof NotFoundException)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
