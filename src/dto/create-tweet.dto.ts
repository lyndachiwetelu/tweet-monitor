import * as moment from 'moment'

export class CreateTweetDto {
    tweetId: string;
    authorId: string;
    username: string;
    text: string;
    createdAt: Date;
    fetchedAt: Date;
  }

export function createTweetDtoFromJson(json: any): CreateTweetDto
{
    const data = json.data
    const users = json.includes.users.filter(user => user.id === data.author_id)
    const user = users[0]
    const tweetDto = new CreateTweetDto()
    tweetDto.tweetId = data.id
    tweetDto.authorId = data.author_id
    tweetDto.username = user.username
    tweetDto.text = data.text
    tweetDto.createdAt = data.created_at
    tweetDto.fetchedAt = new Date()

    return tweetDto
}