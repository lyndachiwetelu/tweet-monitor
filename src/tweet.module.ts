import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet,TweetSchema } from './schemas/tweet.schema';
import { TweetService } from './tweet.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }])],
  exports: [MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }])],
  controllers: [],
  providers: [TweetService],
})
export class TweetsModule {}