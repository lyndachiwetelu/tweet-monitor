import { Injectable } from '@nestjs/common';
import { Tweet } from './schemas/tweet.schema';
import '@tensorflow/tfjs-node'
import '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

@Injectable()
export class ToxicityService {
    async checkToxicity(tweets: Tweet[]): Promise<Array<Array<boolean>>> {

        const texts = tweets.map(tweet => tweet.text)

        const threshold = 0.9;

        const model =  await toxicity.load(threshold, ['toxicity', 'severe_toxicity', 'obscene'])
        const predictions = await model.classify(texts)

        let results = []
        
        predictions.map(prediction => prediction.results).forEach((predictionResult:any) => { 
            predictionResult.forEach((result:any, i:number) => {
                results[i] = i in results && Array.isArray(results[i]) ? results[i].concat([result.match]): [result.match]
            })
        })

        return new Promise(resolve => resolve(results))
    }
}
