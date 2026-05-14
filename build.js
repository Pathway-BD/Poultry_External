const { minify } = require('html-minifier-terser');
const fs = require('fs');
const path = require('path');

const DIST = 'dist';

// Conservative settings: only remove HTML comments and collapse HTML whitespace.
// <script> and <style> block contents are NOT touched (minifyJS/CSS: false).
const OPTIONS = {
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  preserveLineBreaks: false,
  minifyJS: false,
  minifyCSS: false,
  removeAttributeQuotes: false,
  collapseBooleanAttributes: false,
  removeEmptyAttributes: false,
  removeOptionalTags: false,
  removeRedundantAttributes: false,
};

async function build() {
  fs.mkdirSync(DIST, { recursive: true });

  for (const file of ['index.html', 'sharing.html']) {
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf8');
    const out = await minify(src, OPTIONS);
    fs.writeFileSync(path.join(DIST, file), out);
    const kb = n => (Buffer.byteLength(n, 'utf8') / 1024).toFixed(0) + 'KB';
    console.log(`${file}: ${kb(src)} → ${kb(out)}`);
  }

  for (const f of fs.readdirSync('.')) {
    if (f.endsWith('.png') || f === 'manifest.json') {
      fs.copyFileSync(f, path.join(DIST, f));
    }
  }

  console.log('Build complete → dist/');
}

build().catch(err => { console.error(err); process.exit(1); });
