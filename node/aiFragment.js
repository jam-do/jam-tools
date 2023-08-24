import { AiConnector } from '../iso/AiConnector.js';
import { processAiImages } from './processAiImages.js';
import CFG from './CFG.js';

const aiConnector = new AiConnector(CFG.aiOrgId, CFG.aiApiKey);

/**
 * 
 * @param {String} prompt 
 * @returns {Promise<String>}
 */
export async function aiFragment(prompt) {
  let aiHtml = await aiConnector.html(prompt);
  console.log(`AI HTML Fragment created for: ${prompt}`);
  return await processAiImages(aiHtml, aiConnector);
}