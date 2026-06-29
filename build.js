// Build step: bundles the modular source (index.html + styles.css + journey.js +
// engine.js + assets/) into a single self-contained `crocs-demo.html`.
//
// Why: browsers treat file:// URLs as unique origins and block external JS/CSS/
// images, so the split files only work over http(s). Inlining everything (CSS,
// scripts, and images as base64 data URIs) produces one file that runs anywhere —
// double-click, email it, drop it on a server — with no dependencies.
//
// Edit the source files, then run:  node build.js

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

function dataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
    : ext === 'png' ? 'image/png'
    : ext === 'gif' ? 'image/gif'
    : ext === 'svg' ? 'image/svg+xml'
    : 'application/octet-stream';
  return 'data:' + mime + ';base64,' + fs.readFileSync(path.join(dir, file)).toString('base64');
}

let html = read('index.html');
const css = read('styles.css');
const engine = read('engine.js');

// Inline the IMG asset paths in journey.js as base64 data URIs.
let journey = read('journey.js').replace(/'assets\/([^']+)'/g, (_, f) => "'" + dataUri('assets/' + f) + "'");

// Inline the header avatar.
html = html.replace(/src="assets\/avatar\.png"/, 'src="' + dataUri('assets/avatar.png') + '"');

// Inline CSS.
html = html.replace(/<link rel="stylesheet" href="styles\.css">/, '<style>\n' + css + '</style>');

// Inline scripts (journey before engine — order matters).
html = html.replace(/<script src="journey\.js"><\/script>/, '<script>\n' + journey + '\n</script>');
html = html.replace(/<script src="engine\.js"><\/script>/, '<script>\n' + engine + '\n</script>');

fs.writeFileSync(path.join(dir, 'crocs-demo.html'), html);

// Sanity: warn if any external reference survived.
const leftovers = html.match(/(href|src)="(?!data:)[^"]+"/g) || [];
console.log('Built crocs-demo.html (' + Math.round(html.length / 1024) + ' KB)');
console.log(leftovers.length ? 'WARNING external refs remain: ' + leftovers.join(', ') : 'Self-contained: no external references.');
