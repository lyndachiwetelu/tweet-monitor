import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { StreamService } from './services/stream.service'
import { AnomalyDetectionService } from './services/anomaly.detection.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const streamService = app.get(StreamService)
  const anomalyDetectionService = app.get(AnomalyDetectionService)
  const streamServicePromise = new Promise((resolve) => {
      resolve(streamService.streamTweets())
  })
  const anomalyDetectionServicePromise = new Promise((resolve) => {
    resolve(anomalyDetectionService.start())
  })
  await app.listen(3000);
  Promise.all([streamServicePromise, anomalyDetectionServicePromise])
}
bootstrap();
