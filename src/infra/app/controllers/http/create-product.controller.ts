import { Body, Controller, Post } from '@nestjs/common'
import { ProductPresenter } from '@/infra/app/controllers/presenters/product-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateProduct } from '@/domain/application/use-cases/create-product'

const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)
type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@ApiTags('Product')
@Controller('product')
export class CreateProductController {
  constructor(private readonly createProduct: CreateProduct) {}

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
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async handler(@Body(bodyValidationPipe) body: CreateProductBodySchema) {
    const { name, price, description } = body
    const { product } = await this.createProduct.execute({
      name,
      price,
      description,
    })
    return ProductPresenter.toHttp(product)
  }
}
