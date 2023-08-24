
/** @type {import('openai')} */
let openai;

if (typeof window !== 'undefined') {
  const networkImport = (await import('./networkImport.js')).networkImport;
  openai = await networkImport('openai@3.3.0');
} else {
  openai = await import('openai');
}

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

  #cfg;

  /** @type {Object<string, String>} */
  responseMap = {}

  /**
   * 
   * @param {String} orgId Organization ID
   * @param {String} apiKey OpenAI API Key
   * @param {String} [modelName] ChatGPT model name. Default: gpt-3.5-turbo
   */
  constructor(orgId, apiKey, modelName = 'gpt-3.5-turbo') {
    this.#cfg = new openai.Configuration({
      organization: orgId,
      apiKey: apiKey,
    });
    this.ai = new openai.OpenAIApi(this.#cfg);
    this.modelName = modelName;
  }

  /**
   * 
   * @param {String} prompt 
   * @returns {Promise<String>}
   */
  async html(prompt) {
    let resp = await this.ai.createChatCompletion({
      model: this.modelName,
      messages: [
        { 
          role: 'user',
          content: topicCtxMap.htmlStart + ' ' + prompt + ' ' + topicCtxMap.htmlEnd,
        },
      ],
    });
    return resp.data.choices[0].message.content;
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
    let response = await this.ai.createChatCompletion({
      model: this.modelName,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    return response.data.choices[0].message.content;
  }

  /**
   * 
   * @param {String} prompt 
   * @param {256 | 512 | 1024} [size] 
   * @returns {Promise<String>}
   */
  async createImage(prompt, size = 256) {
    let resp = await this.ai.createImage({
      prompt: prompt + ' ' + topicCtxMap.img,
      n: 1,
      // @ts-ignore
      size: `${size}x${size}`,
      response_format: 'b64_json',
    });
    return resp.data.data[0].b64_json;
  }

}
