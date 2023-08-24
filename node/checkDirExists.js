import fs from 'fs';
import path from 'path';

/**
 * 
 * @param {String} dirPath
 */
export function checkDirExists(dirPath) {
  let dir = dirPath.split('/').filter((part, idx) => {
    return !(idx !== 0 && part.includes('.'));
  }).join('/');
  console.log('OUT DIR: ' + dirPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
}