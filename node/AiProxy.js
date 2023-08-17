import CFG from './CFG.js';
import http from 'node:http';
import { AiConnector } from '../iso/AiConnector.js';

export class AiProxy {

  constructor() {
    this.orgId = CFG.aiOrgId;
    this.apiKey = CFG.aiApiKey;
    this.ai = new AiConnector(this.orgId, this.apiKey);
    this.httpServer = http.createServer(async (request, response) => {
      let prompt = '';

      request.on('data', (chunk) => {
        prompt += chunk;
      });

      request.on('end', async () => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        if (request.url.endsWith('/html/')) {
          response.end(await this.ai.html(prompt));
        } else if (request.url.endsWith('/img/')) {
          // let imgPrompt = await this.ai.ask('Write the prompt for the hight quality photorealistic result image generation. Do not exceed the maximum prompt length. Use this initial image description: ' + prompt);
          let imgB64 = await this.ai.createImage(prompt);
          response.end(imgB64);
        } else {
          response.end(await this.ai.text(prompt));
        }
      });
    });
  }

  start() {
    let port = process.env.GPT_PORT || process.argv[2];
    this.httpServer.listen(port);
    console.log('AI proxy started at ' + port);
  }

}

let proxy = new AiProxy();
proxy.start();