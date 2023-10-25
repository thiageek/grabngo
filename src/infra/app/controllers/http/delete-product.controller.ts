import { Controller, Delete, Param } from '@nestjs/common'
import { DeleteProduct } from '@/domain/application/use-cases/delete-product'

@Controller('product/:id')
export class DeleteProductController {
  constructor(private readonly deleteProduct: DeleteProduct) {}

  @Delete()
  async handler(@Param('id') id: string) {
    await this.deleteProduct.execute({ id })
    return { id }
  }
}
