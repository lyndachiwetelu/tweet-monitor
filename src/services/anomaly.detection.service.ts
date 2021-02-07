import { Injectable } from '@nestjs/common';
import { Tweet } from '../schemas/tweet.schema';
import { TweetService } from './tweet.service'
import * as moment from 'moment'
import { ToxicityService } from './toxicity.service';
import { AlertService } from './alert.service';
import { MetricService } from './metric.service';
import * as dotenv from 'dotenv'
dotenv.config()


@Injectable()
export class AnomalyDetectionService {
    constructor(private readonly tweetService: TweetService, 
        private readonly toxicityService: ToxicityService,
        private readonly alertService: AlertService,
        private readonly metricService: MetricService ) {}

    interval:number = parseInt(process.env.INTERVAL) || 10

    // Set the detection process to run every interval minutes
    start(): void {
        this.detectAnomalies()
        setInterval(() => {
            this.detectAnomalies()
        }, this.interval * 60000);
    }

    // Detect anomalies in terms of toxicity of tweets every 10 minutes and trigger an alert
    // This method also save every result iteration in the metrics collection(DB)
    async detectAnomalies(): Promise<void> {
        const fromDate = moment().subtract(this.interval, 'minutes').format()
        const toDate = moment().format()
        const tweets: Array<Tweet> = await this.tweetService.getForTimeFrame({'createdAt': {'$gte': fromDate, '$lte': toDate }})
        let countToxicTweets = 0
        let numberProcessed = 0
        const iterator = 30
        console.log('PROCESSING...')
        while (numberProcessed < tweets.length) {
            const endIndex = (numberProcessed + iterator) < tweets.length ? (numberProcessed + iterator) : tweets.length
            const tweetsToProcess = tweets.slice(numberProcessed, endIndex)
            numberProcessed += tweetsToProcess.length
            try {
                const results = await this.toxicityService.checkToxicity(tweetsToProcess)
                results.forEach((result, i) => {
                    if (result.includes(true)) {
                        countToxicTweets++
                    }
                })
            } catch (error) {
                console.log('Toxicity check API error', error)
            }
        }

        console.log(`${tweets.length} tweets Processed.`)
        console.log('PROCESSING DONE.')

        let lastToxicityCount
        const lastMetric = await this.metricService.getLatest()
     
        if (lastMetric && 'count' in lastMetric) {
            lastToxicityCount = lastMetric.count
        } 

        this.metricService.create({from: fromDate, to: toDate, count: countToxicTweets, createdAt: moment().format()})
        
        // Check if alert should be triggered and trigger it
        if (lastToxicityCount < countToxicTweets) {
            this.alertService.alert({fromDate, toDate, lastToxicityCount, currentToxicityCount: countToxicTweets});
        }

    }
}