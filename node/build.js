import fs from 'fs';
import CFG from './CFG.js';
import { checkDirExists } from './checkDirExists.js';
import { findFiles } from '@jam-do/jam-tools/node/index.js';
import esbuild from 'esbuild';

/**
 * 
 * @param {String} path 
 */
function fmtPath(path) {
  if (path && !path.startsWith('.')) {
    path = './' + path;
  }
  return path;
}

/**
 * 
 * @param {String} path 
 * @returns {Promise<String>}
 */
async function impWa(path) {
  let result = null;
  path = fmtPath(path);
  if (path.includes('/index.js')) {
    let buildResult = esbuild.buildSync({
      entryPoints: [path],
      format: 'esm',
      bundle: true,
      minify: true,
      sourcemap: false,
      target: 'es2019',
      write: false,
    });
    result = buildResult.outputFiles[0].text;
  } else {
    let processRoot = process.cwd();
    let currentUrl = import.meta.url;
    let pathArr = currentUrl.split(processRoot);
    pathArr[1] = path.startsWith('./') ? path.replace('.', '') : path;
    let mdlUrl = pathArr.join(processRoot);
    console.log(mdlUrl);
    try {
      let str = (await import(mdlUrl)).default;
      if (str.constructor === Function) {
        str = str();
      }
      result = str;
    } catch (e) {
      console.log(e);
    }
  }
  return result;
}

/**
 * 
 * @param {String} indexPath 
 */
 async function processIndex(indexPath) {
  let indexSrc = await impWa(indexPath);
  if (!indexSrc) {
    return;
  }
  let outPath = fmtPath(indexPath);
  if (!outPath.includes('index.js')) {
    outPath = outPath.replace('.js', '');
  }
  outPath = outPath.replace(fmtPath(CFG.srcDir), fmtPath(CFG.outDir));
  checkDirExists(CFG.outDir);
  fs.writeFileSync(outPath, indexSrc);
}

export function build() {
  let indexArr = findFiles(CFG.srcDir, ['index.', '.js'], []);
  console.log(indexArr);
  indexArr.forEach((indexPath) => {
    processIndex(indexPath);
  });
}

build();