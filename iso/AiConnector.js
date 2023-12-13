import OpenAI from 'openai';
// /** @type {import('openai')} */
// let OpenAI;

// if (typeof window !== 'undefined') {
//   const networkImport = (await import('./networkImport.js')).networkImport;
//   OpenAI = await networkImport('openai');
// } else {
//   OpenAI = await import('openai');
// }

const topicCtxMap = {
  htmlStart: `This question may contain 2 parts: the text prompt an the structured HTML template to process.`,

  htmlEnd: `Use the HTML format for the response output.
  Do not add any additional comments, descriptions or markdown to the result, use HTML only!
  Use the <x-ai-img> custom tags instead of <img> tags to insert the images.
  IMPORTANT: try to use images each time it's possible to illustrate significant points.
  Use <x-ai-img> tags to illustrate each heading or information block.
  Use the "prompt" attribute for this "x-ai-img" custom tags for the image generation.
  IMPORTANT: use the good and safe prompts, try to not violate your own rules.
  Try to suggest detailed prompts to make images more relevant.
  Write prompts using English.
  IMPORTANT: inner HTML is not allowed in the <x-ai-img> tags, keep them empty.
  Do not forget to close <x-ai-img> tags right after the opening.
  Use <section> tags to make generated content structured.
  Use unique "id" attributes for the each section to make # hash navigation possible.
  Use modern standards.
  Do not add inline styles or style tags.
  Do not use <doctype>, <head>, <title> and <body> tags, the result will be used as a part of the another document.
  Do not provide primitive results with the only image.`,

  img: `Good looking high quality photorealistic image.
  Good mood.
  White background when possible.
  Soft shadows.
  No cropped edges.
  No letters.
  No signs.`,
};

export class AiConnector {

  /** @type {Object<string, String>} */
  responseMap = {}

  /**
   * 
   * @param {String} orgId Organization ID
   * @param {String} apiKey OpenAI API Key
   * @param {String} [modelName] ChatGPT model name. Default: gpt-4-1106-preview
   */
  constructor(orgId, apiKey, modelName = 'gpt-4-1106-preview') {
    // this.#cfg = new OpenAI.Configuration({
    //   organization: orgId,
    //   apiKey: apiKey,
    // });
    this.ai = new OpenAI({
      apiKey,
      organization: orgId,
    });
    this.modelName = modelName;
  }

  /**
   * 
   * @param {String} prompt 
   * @returns {Promise<String>}
   */
  async html(prompt) {
    let completion = await this.ai.chat.completions.create({
      model: this.modelName,
      seed: 12345,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are a HTML-code generator that helps to create websites.',
        },
        { 
          role: 'user',
          content: topicCtxMap.htmlStart + ' ' + prompt + ' ' + topicCtxMap.htmlEnd,
        },
      ],
    });
    return completion.choices[0].message.content;
  }

  async js(prompt) {
    // placeholder
  }

  async css(prompt) {
    // placeholder
  }

  /**
   * 
   * @param {String} prompt 
   * @returns {Promise<String>}
   */
  async text(prompt) {
    let completion = await this.ai.chat.completions.create({
      model: this.modelName,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    return completion.choices[0].message.content;
  }

  /**
   * 
   * @param {String} prompt 
   * @param {'1024x1024' | '1024x1792' | '1792x1024'} [size] 
   * @returns {Promise<String>}
   */
  async createImage(prompt, size = '1024x1024') {
    let resp = await this.ai.images.generate({
      model: 'dall-e-3',
      prompt: prompt + ' ' + topicCtxMap.img,
      n: 1,
      // @ts-ignore
      size: size,
      response_format: 'b64_json',
    });
    return resp.data[0].b64_json;
  }

}
