export class CreateTweetDto {
    tweetId: string;
    authorId: string;
    text: string;
    createdAt: Date
  }

export function createTweetDtoFromJson(json: any): CreateTweetDto
{
    const data = json.data
    const tweetDto = new CreateTweetDto()
    tweetDto.tweetId = data.id
    tweetDto.authorId = data.author_id
    tweetDto.text = data.text
    tweetDto.createdAt = data.created_at

    return tweetDto
}