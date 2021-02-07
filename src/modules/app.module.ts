import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../controllers/app.controller';
import { StreamService } from '../services/stream.service';
import { TweetService } from '../services/tweet.service';
import { TweetModule } from './tweet.module'
import { AnomalyDetectionService } from '../services/anomaly.detection.service'
import { ToxicityService } from '../services/toxicity.service';
import { AlertService } from '../services/alert.service';
import { MetricModule } from './metric.module';
import { MetricService } from '../services/metric.service';
import * as dotenv from 'dotenv'
import { TwitterApiService } from '../services/twitter.api.service';
import { Archive, ArchiveSchema } from 'src/schemas/archive.schema';
import { ArchiveService } from 'src/services/archive.service';
dotenv.config()

const mongoUser = process.env.DB_USER
const mongoUserPass = process.env.DB_USER_PASS

const mongoOptions = {
  authSource: 'admin'
}

@Module({
  imports: [
    TweetModule,
    MetricModule,
    MongooseModule.forRoot(`mongodb://${mongoUser}:${mongoUserPass}@localhost:27017/tweet-monitor`, {
        ...mongoOptions,
        connectionName: 'tweets',
      }),
      MongooseModule.forRoot(`mongodb://${mongoUser}:${mongoUserPass}@localhost:27017/archive`, {
        ...mongoOptions,
        connectionName: 'archive',
      }),
      MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }], 'archive'), 
  ],
  controllers: [AppController],
  providers: [TweetService, StreamService, AnomalyDetectionService, ToxicityService, AlertService, MetricService, TwitterApiService, ArchiveService],
})
export class AppModule {}
