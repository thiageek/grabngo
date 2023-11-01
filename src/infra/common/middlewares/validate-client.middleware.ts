import { ClientRepository } from '@/domain/application/repositories/client-repository'
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class ValidateClientMiddleware implements NestMiddleware {
  logger = new Logger(ValidateClientMiddleware.name)
  constructor(private readonly repository: ClientRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { clientId } = req.body

    if (!clientId) return next()

    const client = await this.repository.find(clientId)

    if (!client) throw new BadRequestException('Invalid client.')

    return next()
  }
}
