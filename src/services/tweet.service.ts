import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tweet, TweetDocument } from '../schemas/tweet.schema';
import { CreateTweetDto } from '../dto/create-tweet.dto';

@Injectable()
export class TweetService {
    constructor(@InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>) {}
    
    async create(tweetDto: CreateTweetDto): Promise<Tweet> {
        const createdTweet = new this.tweetModel(tweetDto);
        return createdTweet.save();
    }

    async getForTimeFrame(filter:any): Promise<Tweet[]> {
      return this.tweetModel.find(filter);
    }

    async countItems(): Promise<number> {
      return this.tweetModel.countDocuments()
    }

    async getOlderTweets(offset:number): Promise<Tweet[]> {
      return this.tweetModel.find().sort({createdAt: -1}).skip(offset)
    }

    async remove(tweet:Tweet) {
      return this.tweetModel.deleteOne(tweet)
    }

    // needed for mocking. there may be a more elegant way
    static createInstanceWithoutConstructor() {
      return Object.create(this.prototype);
    }
}
