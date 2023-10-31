import {
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common'
import { DeleteProduct } from '@/domain/application/use-cases/delete-product'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { JwtGuard } from '@/infra/providers/auth/guards'

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('product/:id')
export class DeleteProductController {
  logger = new Logger(DeleteProductController.name)
  constructor(private readonly deleteProduct: DeleteProduct) {}

  @ApiParam({ name: 'id', description: 'Product id' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Delete()
  async handler(@Param('id') id: string) {
    try {
      this.logger.log(`New request received path /product`)
      await this.deleteProduct.execute({ id })
      return { id }
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
