import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './infra/providers/env/env.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(EnvService)
  app.setGlobalPrefix(`api/${configService.get('VERSION')}`)
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .setTitle('Grabngo')
    .setDescription('The Grabngo API')
    .setVersion(configService.get('VERSION'))
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)
}
bootstrap()
