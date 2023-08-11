const CFG = Object.freeze({
  srcDir: process.argv[2] || process.env.SRC_DIR || './',
  outDir: process.argv[3] || process.env.OUT_DIR || './dist/',
  processor: process.argv[4] || process.env.HANDLER_SCRIPT_PATH || './node_modules/jam-tools/node/build.js',
});

export default CFG;

