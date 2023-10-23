import { Body, Controller, Post } from '@nestjs/common'
import { CreateProduct } from '@/domain/application/use-cases/create-product'
import { ProductPresenter } from '@/infra/app/controllers/presenters/product-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'

const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)
type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('product')
export class CreateProductController {
  constructor(private readonly createProduct: CreateProduct) {}

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
