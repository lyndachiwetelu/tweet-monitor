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
    MongooseModule.forRoot(`mongodb://${mongoUser}:${mongoUserPass}@localhost:27017/tweet-monitor`, mongoOptions),
  ],
  controllers: [AppController],
  providers: [TweetService, StreamService, AnomalyDetectionService, ToxicityService, AlertService, MetricService, TwitterApiService],
})
export class AppModule {}
