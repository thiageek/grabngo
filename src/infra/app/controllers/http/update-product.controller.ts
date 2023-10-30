import { Body, Controller, Param, Put } from '@nestjs/common'
import { ProductPresenter } from '@/infra/app/controllers/presenters/product-presenter'
import { UpdateProduct } from '@/domain/application/use-cases/update-product'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

const updateProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateProductBodySchema)
type UpdateProductBodySchema = z.infer<typeof updateProductBodySchema>

@ApiTags('Product')
@Controller('product/:id')
export class UpdateProductController {
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
    const { name, price, description } = body
    const { product } = await this.updateProduct.execute({
      id,
      name,
      price,
      description,
    })
    return ProductPresenter.toHttp(product)
  }
}
