# Example of simple SAM application

What is this repository? It's a simple example and a seed project for those interested in testing the `aws-sam-local`. Essentially running the Serverless application model (in laymans terms: AWS Lambdas, ApiGateway and the whole hoogey boogey) locally. `aws-sam-local` is developed and maintained by AWS Labs.

The seed consists of the following:

* TypeScript example Lambda
   * `npm run build` compiles it
* JavaScript tests for the example Lambda (I was lazy, didn't bother to compile the tests, extra 5mins of work will fix that)
   * `npm run test` runs the tests

Tests can be found from the directory `tests`. Essentially it uses `mocha` as testing framework and `chai` for BBD -style tests.

The whole idea is to run everything locally (with the below commands to run portion) until you're ready to test in AWS and throw them in there after that. 
 
## Requirements

* [NVM (node version manager)](https://github.com/creationix/nvm)
* [Node](https://nodejs.org/en/), the newer the better. At least ver >6.0.0
* [`aws-sam-local`](https://github.com/awslabs/aws-sam-local)
* [Docker](https://docs.docker.com/engine/installation/)
* [AWS CLI](https://aws.amazon.com/cli/)

## Commands to run

This assumes you've installed Node environment and somewhat understand how nvm, Node and Docker work.

Note you might want to read https://github.com/awslabs/aws-sam-local#installation and fully understand the For maxOS and Windows users part.


```bash
# Install the npm dependencies (SAM)
$ npm install -g aws-sam-local
$ sam --version

    sam version 0.2.4

$ npm run build

    > sam-seed@1.0.0 build ./project
    > tsc

$ npm run test

    > sam-seed@1.0.0 test ./project
    > mocha tests/**/*.js

    Lambda invokation
        handles correct event content by
        ✓ returning the correct "Hello Mika!"
        handles incorrect event content by
        ✓ returning a correct status code


    2 passing (9ms)

# Validate the yaml templates
$ sam validate

    Valid!

# Invokes the SAM tooling and calls the Lambda locally
$ sam local invoke -e event.json Hello
# To run it as a local API, i.e. run it using a local API Gateway.
$ sam local start-api

    2018/01/02 08:50:00 Connected to Docker 1.32
    2018/01/02 08:50:00 Fetching lambci/lambda:nodejs6.10 image for nodejs6.10 runtime...
    nodejs6.10: Pulling from lambci/lambda
    Digest: sha256:0721cee9614fe0c995c2eb0f52b9803a23d1c2da3007d46cb54b745d970850a0
    Status: Image is up to date for lambci/lambda:nodejs6.10

    Mounting index.handler (nodejs6.10) at http://127.0.0.1:3000/hello [GET]

    You can now browse to the above endpoints to invoke your functions.
    You do not need to restart/reload SAM CLI while working on your functions,
    changes will be reflected instantly/automatically. You only need to restart
    SAM CLI if you update your AWS SAM template.

# Open browser to http://127.0.0.1:3000/hello

    2018/01/02 08:50:34 Invoking index.handler (nodejs6.10)
    2018/01/02 08:50:34 Mounting ./project as /var/task:ro inside runtime container
    START RequestId: f405fe79-b406-1e1c-bbb9-cbabb9c6cb29 Version: $LATEST
    2018-01-02T06:50:39.931Z        f405fe79-b406-1e1c-bbb9-cbabb9c6cb29    Debug: event received: {"httpMethod":"GET","body":"","resource":"/hello","requestContext":{"resourcePath":"/hello","httpMethod":"GET","stage":"prod","identity":{"sourceIp":"127.0.0.1:56038"}},"queryStringParameters":{},"headers":{"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","Accept-Encoding":"gzip, deflate, br","Accept-Language":"en-US,en;q=0.9,fi;q=0.8","Connection":"keep-alive","Upgrade-Insecure-Requests":"1","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"},"pathParameters":null,"stageVariables":null,"path":"/hello"}
    END RequestId: f405fe79-b406-1e1c-bbb9-cbabb9c6cb29
    REPORT RequestId: f405fe79-b406-1e1c-bbb9-cbabb9c6cb29  Duration: 9.23 ms       Billed Duration: 0 ms   Memory Size: 0 MB  Max Memory Used: 28 MB

```

There, you've run the SAM tooling locally and tested the Lambda on it's own and through the local API Gateway. 

## Deploying the example to AWS

You need to have `AWS Access Key ID` and `AWS Secret Access Key` at hand. Preferrably configured in with `aws configure`. This guide does not help you with those but assumes you know what you're doing. 

Running the below commands assume that you have everything correctly configured in with `aws configure` so that you can freely use the CLI. `SAM` under the hood just simply uses `AWS CLI` to communicate into AWS.

```bash
# Create a S3 Bucket to store the code into that you are about to deploy.
# Note that the bucket names are, `test-mika` in this example, globally unique and the name might be already in use, just make up a new one that's unique.
$ export BUCKET=test-mika 
$ aws s3 mb s3://$BUCKET

    make_bucket: test-mika

# Now we are going to come up with a name for this stack that we can use to follow it
$ export STACK_NAME=hello

# Package the application for deployment
$ sam package --template-file template.yaml --s3-bucket $BUCKET --output-template-file packaged-template.yml

    Uploading to b5879ebbef3f086910b1b65a577d2805  2927 / 2927.0  (100.00%)
    Successfully packaged artifacts and wrote output template to file packaged-template.yml.
    Execute the following command to deploy the packaged template
    aws cloudformation deploy --template-file packaged-template.yml --stack-name <YOUR STACK NAME>

# Deploy application to AWS
$ sam deploy --template-file packaged-template.yml --stack-name $STACK_NAME --capabilities CAPABILITY_IAM

    Waiting for changeset to be created..
    Waiting for stack create/update to complete
    Successfully created/updated stack - hello
```

At this point you should have a stack with Labmda and API gateway running in the AWS with magic. You can verify this by logging in into your AWS account and see the parts that are running there.

```bash
# To remove the stack, run
$ aws cloudformation delete-stack --stack-name $STACK_NAME
```
