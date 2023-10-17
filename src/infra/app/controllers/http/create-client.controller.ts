import { CreateClient } from '@/domain/application/use-cases/create-client'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ClientPresenter } from '../presenters/client-presenter'

const createClientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createClientBodySchema)
type CreateClientBodySchema = z.infer<typeof createClientBodySchema>

@Controller('client')
export class CreateClientController {
  constructor(private readonly createClient: CreateClient) {}

  @Post()
  async handler(@Body(bodyValidationPipe) body: CreateClientBodySchema) {
    const { name, cpf, email } = body
    const { client } = await this.createClient.execute({ name, cpf, email })
    return ClientPresenter.toHttp(client)
  }
}
