const fs = require('fs');
const path = require('path');

// Create the assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Simple VNPay-like logo (red and blue rectangle)
// This is a very basic representation - you should replace with the actual logo
const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 100;
const ctx = canvas.getContext('2d');

// Draw "VN" in red
ctx.fillStyle = '#ED1C24';
ctx.font = 'bold 60px Arial';
ctx.fillText('VN', 10, 70);

// Draw "PAY" in blue
ctx.fillStyle = '#0054A6';
ctx.fillText('PAY', 80, 70);

// Convert to PNG
const dataUrl = canvas.toDataURL('image/png');
const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

// Write to file
fs.writeFileSync(
  path.join(assetsDir, 'vnpay-logo.png'),
  Buffer.from(base64Data, 'base64')
);

console.log('VNPay logo created successfully!');
