### About this App
With this app you can monitor a hashtag on twitter and see alerts when some anomaly occurs for that hashtag.

### How it works
- With the Twitter streaming API, this app streams tweets in real time, and saves them to a NOSQL Data Store. Mongodb in this case. It then tries to detect some kind of anomalies.

### Prerequisites
- Install Node (comes with npm)
- Install Mongodb on your computer [Here's an official guide to doing that](https://docs.mongodb.com/manual/installation/) just choose your OS and follow the Guide
- Create a user in mongo - On your computer, in mongo shell, Create a user by running these commands. 

⋅⋅⋅First run `use tweet-monitor` and press enter 

⋅⋅⋅Then run `use admin` and press enter, then, run 

`db.createUser({user: "root", pwd: "1234", roles: [{role: "readWrite", db: “tweet-monitor”}]})` 

to create the user.

- You can change the password of the user to fit your wants but as this is a test you can also use the default password in the command above of 1234.

You are now ready to use the app.



### How to use
- Clone this app to your local Machine
- You need a Twitter bearer token to use this app. Set up a twitter project and application on https://developer.twitter.com/, you will get a bearer token. [Follow this guide here](https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens) if it is unclear to you how to go about this 
- Copy the `env.example` file and rename it to 
`.env`, then fill in your bearer token gotten from the application you created in the twitter developers portal beside `TOKEN=`
- In the same env file, beside `HASHTAG=` enter the hashtag you would want to monitor, without the hash sign. For example if you want to monitor #love, your `.env` file should have `HASHTAG=love`  
- Note that you have to monitor a popular hashtag to see quick results


### To run the app:
- Simply run `npm start` in your terminal, or command line, after cd ing into the app folder.

### Data Structure and Storage 
This app saves tweets to a MongoDB store. The data Structure is 
```
 {
  tweetId: string;
  authorId: string;
  username: string;
  text: string;
  createdAt: Date;
}
```
With small naming changes, this datastore can be extended to save for Facebook, Instagram and Youtube as it is saving the most important bits which is the tweetId or postId, authorId in case we need to retrieve details for the author later, username which is good to have as it hardly changes and can be used in linking to the tweet/post, and the actual tweet or post and then date of creation. It is also super easy to extend this data store with more fields.

### Anomaly detection 
Every 10 minutes, a process which was implemented with a simple setInterval checks for anomalies in the numbers of tweets. For the purposes of testing, I chose toxicity of tweets as the metric. So this app checks for toxic tweets every interval and triggers an alert if there is a change(Increase).

One business advantage of this is quickly knowing if your brand is under attack, being mocked, or getting negative engagement on Twitter. And of course when you know this on time you'll be able to mitigate it before the consequences overwhelm you.

Another advantage is by getting Anomalies alerts of hashtags or even just keywords you use in your marketing you can quickly dtermine when that hashtag has been compromised and take steps to redirect your marketing efforts, thereby saving money.

Again if you're having an event, you can monitor the alerts to determine that you are on the right path and that all is going well and your event is being well received. If alerts of rising negativity get to you, you can investigate them further and change the course of your event towards what the people want, or correct your mistakes. This is an example of a real time tool helping you in real time

- [NOTE] The alert is simply a console.log at the moment but can be easily extended to an email alert or notifications to be saved somewhere and displayed to interested parties 


### To quickly see results for anomaly detection:
 - you may modify the INTERVAL in the `.env` file to the number of minutes you want it to check results for and also use a controversial hashtag e.g #donaldtrump which as said before you should do by adding it to your `.env` file without the hash under `HASHTAG`

