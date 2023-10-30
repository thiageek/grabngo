import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common'
import { CreateProduct } from 'src/domain/application/use-cases/create-product'
import { ProductPresenter } from '@/infra/app/controllers/presenters/product-presenter'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'

const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  categories: z.array(z.string()).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)
type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@ApiTags('Product')
@Controller('product')
export class CreateProductController {
  logger = new Logger(CreateProductController.name)
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
    try {
      this.logger.log(`New request received path /client`)
      const { name, price, description, categories } = body
      const { product } = await this.createProduct.execute({
        name,
        price,
        description,
        categories,
      })
      return ProductPresenter.toHttp(product)
    } catch (error: any) {
      if (error instanceof ResourceAlreadyExists)
        throw new BadRequestException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
