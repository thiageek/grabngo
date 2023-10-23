import { Body, Controller, Put } from '@nestjs/common'
import { ProductPresenter } from '@/infra/app/controllers/presenters/product-presenter'
import { UpdateProduct } from '@/domain/application/use-cases/update-product'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'

const updateProductBodySchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateProductBodySchema)
type UpdateProductBodySchema = z.infer<typeof updateProductBodySchema>

@Controller('product')
export class UpdateProductController {
  constructor(private readonly updateProduct: UpdateProduct) {}

  @Put()
  async handler(@Body(bodyValidationPipe) body: UpdateProductBodySchema) {
    const { id, name, price, description } = body
    const { product } = await this.updateProduct.execute({
      id,
      name,
      price,
      description,
    })
    return ProductPresenter.toHttp(product)
  }
}
