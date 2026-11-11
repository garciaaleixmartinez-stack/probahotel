// Uneix src/ en un sol fitxer: dist/index.html
// Ús: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const read = (f) => readFileSync(new URL('./src/' + f, import.meta.url), 'utf8');

const html = `<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F5F5F7">
<title>PAUta · Prepara la selectivitat</title>
<style>
${read('style.css')}
</style>
</head>
<body>
<div id="root"></div>
<script>
${read('data.js')}
${read('plan.js')}
${read('app.js')}
</script>
</body>
</html>
`;

mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/index.html', import.meta.url), html);
console.log('dist/index.html creat (' + Math.round(html.length / 1024) + ' KB)');
