const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindPostcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

async function build() {
  const inPath = path.resolve(__dirname, '../src/styles/tailwind-test.css');
  const outDir = path.resolve(__dirname, '../build');
  const outPath = path.join(outDir, 'tailwind-test.css');

  const input = fs.readFileSync(inPath, 'utf8');

  const configPath = path.resolve(__dirname, '../tailwind.config.cjs');
  const config = require(configPath);
  console.log('Using tailwind config content:', config.content);

  const processor = postcss([
    tailwindPostcss(config),
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
