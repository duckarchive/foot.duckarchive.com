import { copyFileSync, readFileSync, writeFileSync } from 'fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('404.html created');

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const prlibPath = 'dist/prlib.html';
const html = readFileSync(prlibPath, 'utf8');
writeFileSync(prlibPath, html.replaceAll('__PRLIB_VERSION__', version));
console.log(`prlib.html version injected: ${version}`);
