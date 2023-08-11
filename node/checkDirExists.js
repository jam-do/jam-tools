import fs from 'fs';
import path from 'path';

/**
 * 
 * @param {String} dirPath
 */
export function checkDirExists(dirPath) {
  let dir = dirPath.endsWith('/') ? dirPath : path.dirname(dirPath);
  console.log('OUT DIR: ' + dirPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
}