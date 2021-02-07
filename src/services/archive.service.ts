import { Injectable } from '@nestjs/common';
import { TweetService } from './tweet.service';
import * as dotenv from 'dotenv'
import { Archive, ArchiveDocument } from 'src/schemas/archive.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
dotenv.config()

@Injectable()
export class ArchiveService {
    tweetDataLimit:number = parseInt(process.env.TWEET_DATA_LIMIT)
    typeOfTweet:string = 'tweet'

    constructor(@InjectModel(Archive.name) private archiveModel: Model<ArchiveDocument>,
    private readonly tweetService: TweetService) {}

    // Checks whether to archive every minute
    startArchiving(): void {
        this.archiveTweets()
        setInterval(() => {
            this.archiveTweets()
        }, 60000);
    }

    async archiveTweets(): Promise<void> {
        const tweetCount = await this.tweetService.countItems()
        
        if (tweetCount > this.tweetDataLimit) {
            console.log('Beginning to Archive...')
            const tweetstoArchive = await this.tweetService.getOlderTweets(this.tweetDataLimit)
            await ( async() => {
                tweetstoArchive.forEach( async (tweet) => {
                    try {
                        const tweetArchive = {data: tweet, type:this.typeOfTweet, createdAt: new Date()}
                        const archivedTweet = new this.archiveModel(tweetArchive)
                        const response = await archivedTweet.save()
                        if (response) {
                            this.tweetService.remove(tweet)
                        }
                    } catch (error) {
                        console.log('Tweet not archived')
                    }
                });

                console.log('Tweets Archived!');

            })()
             
          
        }
    }
}