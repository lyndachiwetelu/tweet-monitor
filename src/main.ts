import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StreamService } from './stream.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(StreamService)
  await app.listen(3000);
  appService.streamTweets()
}
bootstrap();
