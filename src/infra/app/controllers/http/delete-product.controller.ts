import { Controller, Delete, Param } from '@nestjs/common'
import { DeleteProduct } from '@/domain/application/use-cases/delete-product'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Product')
@Controller('product/:id')
export class DeleteProductController {
  constructor(private readonly deleteProduct: DeleteProduct) {}

  @ApiParam({ name: 'id', description: 'Product id' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Delete()
  async handler(@Param('id') id: string) {
    await this.deleteProduct.execute({ id })
    return { id }
  }
}
