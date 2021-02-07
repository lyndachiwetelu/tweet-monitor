import { Injectable } from '@nestjs/common';
import * as needle from 'needle'
import * as dotenv from 'dotenv'
dotenv.config()
import { Rules } from '../interfaces/rules.interface'

@Injectable()
export class TwitterApiService {
    twitterRulesUrl: string = process.env.TWITTER_RULES_URL
    token: string = process.env.TOKEN

    async getRules(): Promise<Rules> {
        const response = await needle('get', this.twitterRulesUrl, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })
        return new Promise((resolve) => resolve(response.body))
    }

    async postRules(data:any): Promise<Rules> {
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

    async deleteRules(data:any): Promise<Rules> {
        const response = await needle('post', this.twitterRulesUrl, data, {
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
          })

        return new Promise((resolve) => resolve(response.body))
    } 
}
