import fs from 'fs';
import path from 'path';

/**
 * 
 * @param {String} dirPath
 */
export function checkDirExists(dirPath) {
  let dir = path.dirname(dirPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
}