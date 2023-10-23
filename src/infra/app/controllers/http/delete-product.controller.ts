import { Body, Controller, Delete } from "@nestjs/common"
import { DeleteProduct } from '@/domain/application/use-cases/delete-product'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'

const deleteProductBodySchema = z.object({
  id: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteProductBodySchema)
type DeleteProductBodySchema = z.infer<typeof deleteProductBodySchema>

@Controller('product')
export class DeleteProductController {
  constructor(private readonly deleteProduct: DeleteProduct) {}

  @Delete()
  async handler(@Body(bodyValidationPipe) body: DeleteProductBodySchema) {
    const { id } = body
    await this.deleteProduct.execute({ id })
    return { id }
  }
}
