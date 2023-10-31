import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { FindClient } from '@/domain/application/use-cases/find-client'
import { ClientPresenter } from '@/infra/app/controllers/presenters/client-presenter'
import { ApiCreatedResponse, ApiNotFoundResponse } from "@nestjs/swagger"
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'

@Controller('client')
export class FindClientController {
  logger = new Logger(FindClientController.name)
  constructor(private readonly findClient: FindClient) {}

  @ApiCreatedResponse({ description: 'Created' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get()
  async handler(@Query('cpf') cpf: string) {
    try {
      this.logger.log(`New request received path /client`)
      const client = await this.findClient.execute(cpf)
      return ClientPresenter.toHttp(client!)
    } catch (error: any) {
      if (error instanceof ResourceNotFound)
        throw new NotFoundException(error.message)
      this.logger.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
