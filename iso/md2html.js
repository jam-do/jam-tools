// @ts-ignore
import { marked } from 'https://esm.sh/marked@5.1.1?bundle';
// @ts-ignore
import { markedHighlight } from 'https://esm.sh/marked-highlight@2.0.1?bundle';
// @ts-ignore
import hljs from 'https://esm.sh/highlight.js@11.8.0?bundle';

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, {language}).value;
  }
}));

/**
 * 
 * @param {String} mdTxt 
 * @returns {String}
 */
export function md2html(mdTxt) {
  return marked.parse(mdTxt);
}