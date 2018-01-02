"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = (event, context, callback) => {
    console.log(`Debug: event received: ${JSON.stringify(event)}`);
    const body = `Hello ${event.body ? event.body : 'World'}!`;
    const statusCode = 200;
    // Just throw in some async stuff to mislead everybody <3 :) 
    new Promise((resolve, reject) => resolve())
        .then(_ => callback(null, { statusCode, body }))
        .catch(error => callback(error));
};
//# sourceMappingURL=index.js.map