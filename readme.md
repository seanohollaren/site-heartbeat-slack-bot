# Website Health Monitor Slack Bot

A lambda-based monitor which watches a web page or service and posts an alert to Slack if goes down.

<br>

## Configuration

The monitor's options are configured in `config.yml`

**`serviceEndpoint`** - The url for the web page or service that you want to monitor.

**`httpMethod`** - The HTTP method the monitor should use when performing its request.  The options are `GET` and `POST`.  If you're using `POST`, set the request body that will be sent in the `payload.json` file.

**`slackEndpoint`** - The Incoming Webhook integration url given to you by Slack.  This allows the monitor to alert a specified Slack channel when a failure occurs.  See the *Setting Up a Slack Integration* section below for details.

**`interval`** - The frequency at which the monitor should check the `serviceEndpoint`.  Accepts minutes/hours/days.

<br>

## Deployment

This lambda uses the Serverless framework.

First, follow the steps in the `Prerequisites` section of the [Serverless Quick Start](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) guide.

Once you have Serverless installed and your AWS credentials are configured for your environment, deploy the service with:

`serverless deploy`

<br>

## Setting Up a Slack Integration

To allow your monitor to post to Slack when it needs to, you'll need to create an app which has permissions to post to a channel.


1. Head to https://api.slack.com/apps

2. Click Create New App

3. Choose the Slack team you'd like the bot to post to and give it a unique name

4. Click Create App

5. Now we'll give your bot the ability to send a message to a channel by creating a new Incoming Webhook integration

6. Under Features > Incoming Webhooks, toggle it On

7. Click Add New Webhook to Team

8. Choose the channel you'd like your bot to be able to post to

9. Copy the generated Webhook URL and paste it in the `slackEndpoint` property in the code's config.yml file

<br>

## Testing

First, install the project's dependencies with:

`npm install`

<br>

To test the lambda locally before deploying, invoke the function with:

`serverless invoke local --function heartbeat`

<br>


To test the live function after it has been deployed to AWS, invoke it with:

`serverless invoke --function heartbeat`

<br>

## Updating the Code

If you made updates to your function after it has been deployed, you can push those updates to AWS by using the same Serverless deploy command:

`serverless deploy`

<br>

## Cost

Since the bot is lambda-based, it should fall well within AWS Lambda's Free Tier, so it will cost you nothing.

If you have enough other lambda functions running that you are no longer in the free tier, the estimated cost of this lambda at the default 10 minute interval is $0.02 per month.
