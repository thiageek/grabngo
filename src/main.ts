import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './infra/providers/env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(EnvService)
  app.setGlobalPrefix(`api/${configService.get('VERSION')}`)
  const port = configService.get('PORT')
  await app.listen(port)
}
bootstrap()
