import { Test } from '@nestjs/testing';
import { Rules } from 'src/interfaces/rules.interface';
import { StreamService } from './stream.service';
import { TweetService } from './tweet.service';
import { TwitterApiService } from './twitter.api.service';
import { MongooseModule } from '@nestjs/mongoose';


describe('StreamService', () => {
    let streamService: StreamService;
    let twitterApiService: TwitterApiService
    let tweetService: TweetService
    let mockTweetService:TweetService = TweetService.createInstanceWithoutConstructor()

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [StreamService, TwitterApiService, {
            provide: TweetService,
            useValue: mockTweetService,
          }],
      }).compile();

    streamService = moduleRef.get<StreamService>(StreamService);
    twitterApiService = moduleRef.get<TwitterApiService>(TwitterApiService);
    tweetService = moduleRef.get<TweetService>(TweetService);
  });


  describe('getRules', () => {
    it('should return an object containing an array of rules', async () => {
        const rules =  {
            data: [ { id: '1358330345700130818', value: '#love' } ],
            meta: { sent: '2021-02-07T08:31:39.525Z' }
        }
      
        jest.spyOn(twitterApiService, 'getRules').mockImplementation(async(): Promise<Rules> => new Promise(resolve => resolve(rules)));
        expect(await streamService.getRules()).toBe(rules);
    });
  });

  describe('postRules', () => {
    it('should return an object containing an array of rules and summary', async () => {
        const data = [{value: '#love'}]
        const rules = {
            data: [ { value: '#love', id: '1358353139561353218' } ],
            meta: {
              sent: '2021-02-07T09:53:21.462Z',
              summary: { created: 1, not_created: 0, valid: 1, invalid: 0 }
            }
          }
      
        jest.spyOn(twitterApiService, 'postRules').mockImplementation(async(): Promise<Rules> => new Promise(resolve => resolve(rules)));
        expect(await streamService.setRules(data)).toBe(rules);
    });
  });

  describe('deleteRules', () => {
    it('should return an object containing an array of rules and deletion summary', async () => {
        const postData = new Promise<Rules>(resolve => { resolve({
            data: [ { id: '1358330345700130818', value: '#love' } ],
            meta: { sent: '2021-02-07T08:31:39.525Z' }
        })})

        const rules = {
            data: [ { value: '#love', id: '1358353139561353218' } ],
            meta: {
              sent: '2021-02-07T09:53:21.462Z',
              summary: { created: 1, not_created: 0, valid: 1, invalid: 0 }
            }
          }
      
        jest.spyOn(twitterApiService, 'deleteRules').mockImplementation(async(): Promise<Rules> => new Promise(resolve => resolve(rules)));
        expect(await streamService.deleteRules(postData)).toBe(rules);
    });
  });
});
