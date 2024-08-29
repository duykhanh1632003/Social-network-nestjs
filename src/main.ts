import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SocketIoAdapter } from './chatroom/socket-io.adapters';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(Logger)
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    }
  }
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document,swaggerCustomOptions);

  app.useStaticAssets(join(__dirname, '..', 'static'))
  app.useWebSocketAdapter(new SocketIoAdapter(app))
  await app.listen(port);
  Logger.log(`Application running at ${port}`); // Log khi ứng dụng bắt đầu
}
bootstrap();
