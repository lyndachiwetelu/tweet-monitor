import { Injectable } from '@nestjs/common';
import * as needle from 'needle'
import { exit } from 'process';
import { TweetService } from './tweet.service'
import { createTweetDtoFromJson } from '../dto/create-tweet.dto'
import * as dotenv from 'dotenv'
import { Stream } from 'stream';
import { TwitterApiService } from './twitter.api.service';
import { Rule } from '../interfaces/rule.interface'
import { Rules } from '../interfaces/rules.interface'
dotenv.config()

@Injectable()
export class StreamService {
  newRules: Array<Rule> = [{ value: `#${process.env.HASHTAG}`}]
  twitterStreamUrl: string = process.env.TWITTER_STREAM_URL
  token: string = process.env.TOKEN

  constructor(private readonly tweetService: TweetService, 
    private readonly apiService: TwitterApiService) {}

  // stream tweets and save to DB tweets collection
  async streamTweets(): Promise<Stream> {
    
    let currentRules = this.getRules()
    await this.deleteRules(currentRules)
    await this.setRules(this.newRules)
    await this.getRules()
    const tweetStream = needle.get(this.twitterStreamUrl, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    tweetStream.on('data', async (data) => {
      try {
        const json = JSON.parse(data)
        const tweetDto = createTweetDtoFromJson(json)
        await this.tweetService.create(tweetDto)
        console.log(JSON.stringify(json))
      } catch (error) {}
    }).on('error', error => {
      if (error.code === 'ETIMEDOUT') {
        tweetStream.emit('timeout');
      }  
    })

    return tweetStream

  }

  // Set Rules for the Twitter API
  async setRules(rules: Array<Rule>): Promise<Object> {
    const data = {
      add: rules,
    }
    try {
      const response = await this.apiService.postRules(data)
      return new Promise(resolve =>  {resolve(response)})

    } catch(error) {
      console.log(error)
      exit(1)
    }
  }

  // Get rules from the Twitter API
  async getRules(): Promise<Rules> {
    try {
      const response = await this.apiService.getRules()
      return new Promise<Rules>((resolve) => {
        resolve(response);
      });

    } catch (error) {
      console.log(error)
      exit(1)
    }
  }

  // Delete Rules from the Twitter API
  async deleteRules(rulesPromise: Promise<Rules>): Promise<Rules>  {
    const rules = await rulesPromise
    if (!Array.isArray(rules.data)) {
      return
    }
    
    const ids = rules.data.map((rule) => rule.id)
  
    const data = {
      delete: {
        ids: ids,
      },
    }

    const response = await this.apiService.deleteRules(data)

    return new Promise<any>((resolve) => {
      resolve(response);
    });
  }


  // connect to stream and reconnect on error 
  async connectToStream(): Promise<void> {
    const stream = await this.streamTweets();
    let timeout = 0;
    stream.on('timeout', () => {
        console.warn('Connection error occurred. Attempting to reconnect…');
        setTimeout(() => {
            timeout++;
            this.streamTweets();
        }, 2 ** timeout);
        this.streamTweets();
    })
  }

}
