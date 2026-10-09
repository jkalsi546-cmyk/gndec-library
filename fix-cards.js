const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function replaceInFile(filePath, regex, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
  }
}

// 1. main.js - replace footer and button in createBookCard
replaceInFile(path.join(publicDir, 'js', 'main.js'),
  /<div class="book-card-footer">[\s\S]*?<button class="btn-add-cart".*?>[\s\S]*?<\/button>/g,
  `<div class="book-card-footer" style="justify-content: center; margin-top: 10px;">
          <a href="https://openlibrary.org/works/\${book.id}" target="_blank" class="btn-primary" style="background: var(--accent); color: white; border: none; text-decoration: none; display: block; width: 100%; text-align: center; padding: 10px 0; border-radius: 4px;">
            📖 Read Online
          </a>
        </div>`
);

// 2. wishlist.js - replace footer and button
replaceInFile(path.join(publicDir, 'js', 'wishlist.js'),
  /<div class="book-card-footer">[\s\S]*?<button class="btn-primary wishlist-add-cart".*?>[\s\S]*?<\/button>/g,
  `<div class="book-card-footer" style="justify-content: center; margin-top: 10px;">
            <a href="https://openlibrary.org/works/\${book.id}" target="_blank" class="btn-primary" style="background: var(--accent); color: white; border: none; text-decoration: none; display: block; width: 100%; text-align: center; padding: 10px 0; border-radius: 4px;">
              📖 Read Online
            </a>
          </div>`
);

console.log('Book cards updated.');
