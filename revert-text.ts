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

const replacements = [
  { from: /RYK Hotel/g, to: 'Lahore Girls Hostel' },
  { from: /Rahim Yar Khan/g, to: 'Lahore' },
  { from: /Inside Hotel/g, to: 'Inside Hostel' },
  { from: /Outside Hotel/g, to: 'Outside Hostel' },
  { from: /Hotel Building/g, to: 'Hostel Building' },
  { from: /hotel life/g, to: 'hostel life' },
  { from: /Premium Hotel/g, to: 'Premium Girls Hostel' },
  { from: /guests and professionals/g, to: 'female students and professionals' },
  { from: /environment for guests/g, to: 'environment for women' },
  { from: /modern guest's needs/g, to: "modern woman's needs" },
  { from: /ambitious and bright guests/g, to: 'ambitious and bright young women' },
  { from: /Hear from the guests/g, to: 'Hear from the girls' },
  { from: /guests can focus/g, to: 'women can focus' },
  { from: /needs of our guests/g, to: 'needs of Pakistani women' },
  { from: /independent individuals/g, to: 'independent women' },
  { from: /Guests are allowed between/g, to: 'Female guests are allowed between' },
  { from: /Visitors are only permitted/g, to: 'Male guests are only permitted' },
  { from: /by students and professionals/g, to: 'by female students and professionals' },
  { from: /name: 'RYK Hotel'/g, to: "name: 'Lahore Girls Hostel'" },
  { from: /short_name: 'RYK'/g, to: "short_name: 'LGH'" }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  replacements.forEach(r => {
    newContent = newContent.replace(r.from, r.to);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
