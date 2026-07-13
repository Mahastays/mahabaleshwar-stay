const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        replaceInDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('brand-green') || content.includes('cream')) {
        let newContent = content.replace(/brand-green/g, 'brand-red');
        
        newContent = newContent.replace(/bg-cream/g, 'bg-white');
        newContent = newContent.replace(/text-cream/g, 'text-white');
        newContent = newContent.replace(/border-cream/g, 'border-white');
        
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir('d:\\STUDY MATERIAL\\MAHABLESHWAR STAY\\frontend');
console.log('Done replacing colors.');
