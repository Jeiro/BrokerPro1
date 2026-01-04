/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');

async function build() {
  const inPath = path.resolve(__dirname, '../src/styles/tailwind-test.css');
  const outDir = path.resolve(__dirname, '../build');
  const outPath = path.join(outDir, 'tailwind-test.css');

  const input = fs.readFileSync(inPath, 'utf8');

  const processor = postcss([
    tailwind(path.resolve(__dirname, '../tailwind.config.cjs')),
    autoprefixer(),
  ]);

  const result = await processor.process(input, { from: inPath, to: outPath });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, result.css, 'utf8');

  console.log('Wrote', outPath, 'size:', Buffer.byteLength(result.css, 'utf8'));
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
