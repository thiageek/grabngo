import { Controller, Get, Query } from '@nestjs/common'
import { FetchProducts } from '@/domain/application/use-cases/fetch-products'
import { ProductPresenter } from '@/infra/app/controllers/presenters/product-presenter'

@Controller('product')
export class FetchProductsController {
  constructor(private readonly fetchProducts: FetchProducts) {}

  @Get()
  async handler(@Query('q') query: string) {
    const products = await this.fetchProducts.execute({ page: 1, query })
    return products.map((p) => ProductPresenter.toHttp(p))
  }
}
