import 'dotenv/config';
import http from 'node:http';
import { ChatGPT } from '../iso/ChatGPT.js';

export class GPTProxy {

  constructor() {
    this.orgId = process.env.GPT_ORG_ID;
    this.apiKey = process.env.GPT_API_KEY;
    this.gpt = new ChatGPT(this.orgId, this.apiKey);
    this.httpServer = http.createServer(async (request, response) => {
      let prompt = '';

      request.on('data', (chunk) => {
        prompt += chunk;
      });

      request.on('end', async () => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(await this.gpt.ask(prompt));
      });
    });
  }

  start() {
    let port = process.env.GPT_PORT || process.argv[2];
    this.httpServer.listen(port);
    console.log('GPT proxy started at ' + port);
  }

}

let proxy = new GPTProxy();
proxy.start();