import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { StreamService } from './stream.service';
import { TweetService } from './tweet.service';
import { TweetsModule } from './tweet.module'

const mongoOptions = {
  authSource: 'admin'
}

@Module({
  imports: [
    TweetsModule,
    MongooseModule.forRoot('mongodb://root:1234@localhost:27017/tweet-monitor', mongoOptions),
  ],
  controllers: [AppController],
  providers: [TweetService, StreamService],
})
export class AppModule {}
