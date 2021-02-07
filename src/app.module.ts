import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { StreamService } from './stream.service';
import { TweetService } from './tweet.service';
import { TweetModule } from './tweet.module'
import { AnomalyDetectionService } from './anomaly.detection.service'
import { ToxicityService } from './toxicity.service';
import { AlertService } from './alert.service';
import { MetricModule } from './metric.module';
import { MetricService } from './metric.service';

const mongoOptions = {
  authSource: 'admin'
}

@Module({
  imports: [
    TweetModule,
    MetricModule,
    MongooseModule.forRoot('mongodb://root:1234@localhost:27017/tweet-monitor', mongoOptions),
  ],
  controllers: [AppController],
  providers: [TweetService, StreamService, AnomalyDetectionService, ToxicityService, AlertService, MetricService],
})
export class AppModule {}
