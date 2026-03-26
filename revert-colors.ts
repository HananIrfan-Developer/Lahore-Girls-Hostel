import fs from 'fs';
import path from 'path';

function walk(dir: string) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = [...walk('src'), 'index.html', 'vite.config.ts'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/amber-/g, 'pink-')
    .replace(/stone-/g, 'purple-')
    .replace(/#fffbeb/g, '#fdf2f8')
    .replace(/#d97706/g, '#db2777');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
