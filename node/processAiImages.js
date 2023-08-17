import jsdom from 'jsdom';
import { b64Src } from '../iso/b64Src.js';

/**
 * 
 * @param {String} html 
 * @param {import('../iso/AiConnector.js').AiConnector} aiConnector 
 * @returns {Promise<String>}
 */
export async function processAiImages(html, aiConnector) {
  let fragment = jsdom.JSDOM.fragment(html);
  let aiImages = [...fragment.querySelectorAll('x-ai-img')];
  for (let i = 0; i < aiImages.length; i++) {
    let aiImg = aiImages[i];
    let prompt = aiImg.getAttribute('prompt');
    let b64Img = await aiConnector.createImage(prompt);
    aiImg.outerHTML = `<img src="${b64Src(b64Img, 'image/png')}" alt="${prompt}" />`;
  }
  return fragment.serialize();
}