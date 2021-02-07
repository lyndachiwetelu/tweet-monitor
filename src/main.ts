import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { StreamService } from './services/stream.service'
import { AnomalyDetectionService } from './services/anomaly.detection.service'
import { ArchiveService } from './services/archive.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const streamService = app.get(StreamService)
  const anomalyDetectionService = app.get(AnomalyDetectionService)
  const archiveService = app.get(ArchiveService)
  const streamServicePromise = new Promise((resolve) => {
      resolve(streamService.connectToStream())
  })
  const anomalyDetectionServicePromise = new Promise((resolve) => {
    resolve(anomalyDetectionService.start())
  })
  const archiveServicePromise = new Promise((resolve) => {
    resolve(archiveService.startArchiving())
})
  await app.listen(3000);
  Promise.all([streamServicePromise, anomalyDetectionServicePromise, archiveServicePromise])
}
bootstrap();
