const REPLACE_MAP = {
  '  ': ' ',
  '> ': '>',
  ' >': '>',
  '< ': '<',
  ' <': '<',
};

/** @param {String} html */
export function htmlMin(html) {
  html = html.replaceAll('\n', ' ');
  for (let subStr in REPLACE_MAP) {
    while (html.includes(subStr)) {
      html = html.replaceAll(subStr, REPLACE_MAP[subStr]);
    }
  }
  return html;
}