const cdn = 'https://esm.sh/';
const options = '?bundle';

/**
 * 
 * @param {String} packageName 
 * @returns 
 */
export async function networkImport(packageName) {
  return await import(cdn + packageName + options);
}
