
/** @type {import('openai')} */
let openai;

if (typeof window !== 'undefined') {
  const networkImport = (await import('./networkImport.js')).networkImport;
  openai = await networkImport('openai@3.3.0');
} else {
  openai = await import('openai');
}

export class ChatGPT {

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

  async ask(prompt) {
    if (!this.responseMap[prompt]) {
      let aiResponse = await this.ai.createChatCompletion({
        model: this.modelName,
        messages: [
          { 
            role: 'user',
            content: prompt,
          },
        ],
      });
      console.log(aiResponse);
      this.responseMap[prompt] = aiResponse.data.choices[0].message.content;
    }
    return this.responseMap[prompt];
  }

}
