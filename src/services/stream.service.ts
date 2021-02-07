import { Injectable } from '@nestjs/common';
import * as needle from 'needle'
import { exit } from 'process';
import { TweetService } from './tweet.service'
import { createTweetDtoFromJson } from '../dto/create-tweet.dto'
import * as dotenv from 'dotenv'
dotenv.config()

interface Rule {
  value: string
}

interface Rules {
  data?: Array<{id: number, value: string}>
  meta: {
    sent: string
  }
}

@Injectable()
export class StreamService {
  newRules: Array<Rule> = [{ value: `#${process.env.HASHTAG}`}]
  twitterStreamUrl: string = process.env.TWITTER_STREAM_URL
  twitterRulesUrl: string = process.env.TWITTER_RULES_URL
  token: string = process.env.TOKEN

  constructor(private readonly tweetService: TweetService) {}

  // stream tweets and save to DB tweets collection
  async streamTweets(): Promise<void> {
    
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
    })

  }

  // Set Rules for the Twitter API
  async setRules(rules: Array<Rule>): Promise<Object> {
    const data = {
      add: rules,
    }
    try {
      const response = await needle('post', this.twitterRulesUrl, data, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
    
      return new Promise<Rules>((resolve) => {
        resolve(response.body);
      });

    } catch(error) {
      console.log(error)
      exit(1)

    }
    
  }

  // get rules from the Twitter API
  async getRules(): Promise<Rules> {
    try {
      const response = await needle('get', this.twitterRulesUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
  
      return new Promise<Rules>((resolve) => {
        resolve(response.body);
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
  
    const response = await needle('post', this.twitterRulesUrl, data, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    })
  
    return new Promise<Rules>((resolve) => {
      resolve(response.body);
    });
  }
}
