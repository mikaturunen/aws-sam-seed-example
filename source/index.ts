import { Context, Callback, APIGatewayEvent } from "aws-lambda";


exports.handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
    console.log(`Debug: event received: ${JSON.stringify(event)}`)
    
    const body: string = `Hello ${event.body ? event.body : 'World'}!`
    const statusCode: number = 200 

    // Just throw in some async stuff to mislead everybody <3 :) 
    new Promise((resolve, reject) => resolve())
        .then(_ => callback(null, { statusCode, body }))
        .catch(error => callback(error))
}