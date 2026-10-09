const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// 1. Remove Cart from HTML files
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove cart link in navbar
  content = content.replace(/<a href="cart\.html"[^>]*>[\s\S]*?<\/a>/g, '');
  content = content.replace(/<a href="cart\.html">Cart<\/a>/g, ''); // mobile menu
  
  fs.writeFileSync(filePath, content);
});

// 2. Remove Cart file completely
const cartPath = path.join(publicDir, 'cart.html');
const cartJsPath = path.join(publicDir, 'js', 'cart.js');
if (fs.existsSync(cartPath)) fs.unlinkSync(cartPath);
if (fs.existsSync(cartJsPath)) fs.unlinkSync(cartJsPath);

// 3. Fix main.js Badges
const mainJsPath = path.join(publicDir, 'js', 'main.js');
let mainContent = fs.readFileSync(mainJsPath, 'utf8');
mainContent = mainContent.replace(/const cartBadges = document\.querySelectorAll\('\.cart-badge'\);[\s\S]*?\}\);/g, '');
mainContent = mainContent.replace(/const cartCount = getCartCount\(\);/g, '');
fs.writeFileSync(mainJsPath, mainContent);

// 4. Update db.js (Remove cart table)
const dbPath = path.join(__dirname, 'db.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');
dbContent = dbContent.replace(/\/\/ Cart \/ Issued Books Table[\s\S]*?\}\);/g, '');
fs.writeFileSync(dbPath, dbContent);

// 5. Update user.js (Remove cart routes)
const userPath = path.join(__dirname, 'routes', 'user.js');
let userContent = fs.readFileSync(userPath, 'utf8');
userContent = userContent.replace(/\/\* ========================================\s*\* CART ROUTES\s*\* ========================================\s*\*\/[\s\S]*module\.exports/g, 'module.exports');
fs.writeFileSync(userPath, userContent);

console.log('Cart functionality stripped.');
