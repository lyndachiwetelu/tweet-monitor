import { Test } from '@nestjs/testing';
import { Tweet } from '../schemas/tweet.schema';
import { ToxicityService } from './toxicity.service';


describe('ToxicityService', () => {
    let toxicityService: ToxicityService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [ToxicityService],
      }).compile();

    toxicityService = moduleRef.get<ToxicityService>(ToxicityService);
  });

  describe('checkToxicity', () => {
    it('should return an array of results for toxicity matches for toxicity, severe_toxicity and obscene for all inputs', async () => {
      const inputs = ['you suck', 'you are an idiot', 'i am happy'];
      const tweetModels = []
      inputs.forEach(input => {
          const tweetModel = new Tweet()
          tweetModel.text = input
          tweetModels.push(tweetModel)
      })

      const result = [[null, false, true], [false, false, true], [false, false, false]]
      jest.spyOn(toxicityService, 'init').mockImplementation( async(tweetModels): Promise<void> => {});
      jest.spyOn(toxicityService, 'getPredictions').mockImplementation(() => {
        return [
            { label: 'obscene', results: [ {'probabilities': [1.2494949, 1.6995959], 'match' : null}, {'probabilities': [1.2494949, 1.6995959], 'match' : false}, {'probabilities': [1.2494949, 1.6995959], 'match' : false}  ]  },
            { label: 'severe_toxicity',results: [ {'probabilities': [1.2494949, 1.6995959], 'match' : false}, {'probabilities': [1.2494949, 1.6995959], 'match' : false}, {'probabilities': [1.2494949, 1.6995959], 'match' : false}  ] },
            { label: 'toxicity', results: [ {'probabilities': [1.2494949, 1.6995959], 'match' : true}, {'probabilities': [1.2494949, 1.6995959], 'match' : true}, {'probabilities': [1.2494949, 1.6995959], 'match' : false} ] }
         ]
        })

      expect(await toxicityService.checkToxicity(tweetModels)).toStrictEqual(result);
    });
  });
});
