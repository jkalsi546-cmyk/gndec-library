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

// 1. home.js
replaceInFile(path.join(publicDir, 'js', 'home.js'), 
  /<div class="book-price">.*?<\/div>[\s\S]*?<button class="btn-primary" onclick="addToCart\('\${book\.id}'\)">Add to Cart<\/button>/g,
  `<a href="book-detail.html?id=\${book.id}" class="btn-primary" style="display:block;text-align:center;text-decoration:none;background:var(--accent);color:white;">Read Online</a>`
);

// 2. books.js
replaceInFile(path.join(publicDir, 'js', 'books.js'), 
  /<div class="book-price">.*?<\/div>[\s\S]*?<button class="btn-primary" onclick="addToCart\('\${book\.id}'\)">Add to Cart<\/button>/g,
  `<a href="book-detail.html?id=\${book.id}" class="btn-primary" style="display:block;text-align:center;text-decoration:none;background:var(--accent);color:white;">Read Online</a>`
);

// 3. wishlist.js
replaceInFile(path.join(publicDir, 'js', 'wishlist.js'), 
  /<div class="book-price">.*?<\/div>[\s\S]*?<button class="btn-primary" onclick="addToCart\('\${book\.id}'\)">Add to Cart<\/button>/g,
  `<a href="book-detail.html?id=\${book.id}" class="btn-primary" style="display:block;text-align:center;text-decoration:none;background:var(--accent);color:white;">Read Online</a>`
);

// 4. api.js - remove formatPrice function and mock price generation
replaceInFile(path.join(publicDir, 'js', 'api.js'),
  /price: getMockPrice\(id\),/g,
  ''
);

console.log('Book cards updated to Read Online only.');
