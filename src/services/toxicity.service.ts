import { Injectable } from '@nestjs/common';
import { Tweet } from '../schemas/tweet.schema';
import '@tensorflow/tfjs-node'
import '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

@Injectable()
export class ToxicityService {

    model: any
    predictions: any

    getPredictions(): any {
        return this.predictions || []
    }

    async init(tweets: Tweet[]): Promise<void> {
        const threshold = 0.9;
        const texts = tweets.map(tweet => tweet.text)
        const model =  await toxicity.load(threshold, ['toxicity', 'severe_toxicity', 'obscene'])
        const predictions = await model.classify(texts)
        this.model = model
        this.predictions = predictions
    }

    // Check Toxicity of an array of input text, ans return array with results ordered by original array indices
    async checkToxicity(tweets: Tweet[]): Promise<Array<Array<boolean>>> {
        this.init(tweets)
        let results = []
        
        this.getPredictions().map((prediction: any) => prediction.results).forEach((predictionResult:any) => { 
            predictionResult.forEach((result:any, i:number) => {
                results[i] = i in results && Array.isArray(results[i]) ? results[i].concat([result.match]): [result.match]
            })
        })

        return new Promise((resolve, reject) => { 
            resolve(results)
             reject([]) 
        })
    }
}
