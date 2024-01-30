import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ProductPresenter } from '@/infra/app/controllers/presenters/product-presenter'
import { UpdateProduct } from '@/domain/application/use-cases/update-product'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { JwtGuard } from '@/infra/providers/auth/guards'
import { UpdateOrderController } from '@/infra/app/controllers/http/update-order.controller'

const updateProductBodySchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateProductBodySchema)
type UpdateProductBodySchema = z.infer<typeof updateProductBodySchema>

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('product/:id')
export class UpdateProductController {
  logger = new Logger(UpdateOrderController.name)
  constructor(private readonly updateProduct: UpdateProduct) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Product id' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Put()
  async handler(
    @Body(bodyValidationPipe) body: UpdateProductBodySchema,
    @Param('id') id: string,
  ) {
    try {
      this.logger.log(`New request received path /product`)
      const { name, price, description, categories } = body
      const { product } = await this.updateProduct.execute({
        id,
        name,
        price,
        description,
        categories,
      })
      return ProductPresenter.toHttp(product)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
