const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../../frontend');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const replacements = [
  { search: /rose-500/g, replace: 'brand-green' },
  { search: /rose-600/g, replace: 'brand-green' },
  { search: /rose-700/g, replace: 'brand-green' },
  { search: /rose-50/g, replace: 'brand-green/10' },
  { search: /rose-100/g, replace: 'brand-green/20' },
  { search: /blue-50/g, replace: 'brand-brown/10' },
  { search: /blue-100/g, replace: 'brand-brown/20' },
  { search: /blue-600/g, replace: 'brand-brown' },
  { search: /blue-700/g, replace: 'brand-brown' },
];

const files = walkSync(frontendDir);
let filesModified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  replacements.forEach(({ search, replace }) => {
    newContent = newContent.replace(search, replace);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated: ${file}`);
    filesModified++;
  }
});

console.log(`Total files modified: ${filesModified}`);
