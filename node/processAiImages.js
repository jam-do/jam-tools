import jsdom from 'jsdom';
import { b64Src } from '../iso/b64Src.js';

/**
 * 
 * @param {String} html 
 * @param {import('../iso/AiConnector.js').AiConnector} aiConnector 
 * @returns {Promise<String>}
 */
export async function processAiImages(html, aiConnector) {
  let fragment = jsdom.JSDOM.fragment(`<div>${html}</div>`);
  let aiImages = [...fragment.querySelectorAll('x-ai-img')];
  for (let i = 0; i < aiImages.length; i++) {
    let aiImg = aiImages[i];
    let prompt = aiImg.getAttribute('prompt');
    let b64Img = await aiConnector.createImage(prompt);
    aiImg.outerHTML = `<img ai src="${b64Src(b64Img, 'image/png')}" alt="${prompt}" />`;
    console.log(`(${i + 1}/${aiImages.length}) AI Image created for: ${prompt}`);
  }
  return fragment.firstChild.innerHTML;
}