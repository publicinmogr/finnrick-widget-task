#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";

// Build configuration
const BUILD_DIR = "./public";
const WIDGET_VERSION = "1.0.0";

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Read the widget loader
const widgetLoaderPath = "./widget-loader.js";
let widgetContent = fs.readFileSync(widgetLoaderPath, "utf8");

// Update version and URLs for production
widgetContent = widgetContent.replace(
  "const WIDGET_VERSION = '1.0.0';",
  `const WIDGET_VERSION = '${WIDGET_VERSION}';`
);

// Create production version
fs.writeFileSync(path.join(BUILD_DIR, "widget.js"), widgetContent);

// Generate SRI hash for widget.js
const widgetBuffer = Buffer.from(widgetContent, "utf8");
const sha256Hash = crypto
  .createHash("sha256")
  .update(widgetBuffer)
  .digest("base64");
const sha384Hash = crypto
  .createHash("sha384")
  .update(widgetBuffer)
  .digest("base64");
const sha512Hash = crypto
  .createHash("sha512")
  .update(widgetBuffer)
  .digest("base64");

const sriHashes = {
  sha256: `sha256-${sha256Hash}`,
  sha384: `sha384-${sha384Hash}`,
  sha512: `sha512-${sha512Hash}`,
};

// Create integration examples
const integrationExample = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Finnrick Widget - Integration Example</title>
</head>
<body>
  <h1>Finnrick Rating Widget Integration</h1>
  
  <h2>Basic Integration</h2>
  <p>Add this to your website:</p>
  <pre><code>&lt;div class="finnrick-rating" data-product-id="YOUR_PRODUCT_ID"&gt;&lt;/div&gt;
&lt;script src="https://raw.githubusercontent.com/publicinmogr/finnrick-widget-task/refs/heads/main/public/widget.js" async&gt;&lt;/script&gt;</code></pre>

  <h2>Secure Integration (with SRI)</h2>
  <p>For enhanced security, use Subresource Integrity:</p>
  <pre><code>&lt;script 
  src="https://raw.githubusercontent.com/publicinmogr/finnrick-widget-task/refs/heads/main/public/widget.js"
  integrity="${sriHashes.sha384}"
  crossorigin="anonymous"
  async&gt;&lt;/script&gt;</code></pre>

  <h2>Live Examples (using DummyJSON data)</h2>
  
  <h3>Product 1 - iPhone 9</h3>
  <div class="finnrick-rating" data-product-id="product-1"></div>
  
  <h3>Product 2 - iPhone X</h3>
  <div class="finnrick-rating" data-product-id="product-2"></div>
  
  <h3>Product 3 - Samsung Universe 9</h3>
  <div class="finnrick-rating" data-product-id="product-3"></div>

  <script src="./widget.js" async></script>
</body>
</html>`;

fs.writeFileSync(path.join(BUILD_DIR, "example.html"), integrationExample);

console.log("✅ Widget build complete!");
console.log(`📁 Files created in: ${BUILD_DIR}`);
console.log(
  `📦 Widget size: ${(
    fs.statSync(path.join(BUILD_DIR, "widget.js")).size / 1024
  ).toFixed(2)} KB`
);
console.log(`🚀 Ready for deployment!`);

// Display SRI hashes
console.log("\n🔒 Subresource Integrity (SRI) Hashes:");
console.log(`   SHA-256: ${sriHashes.sha256}`);
console.log(`   SHA-384: ${sriHashes.sha384}`);
console.log(`   SHA-512: ${sriHashes.sha512}`);

console.log("\n📋 Secure Integration Code:");
console.log(`<script 
  src="https://raw.githubusercontent.com/publicinmogr/finnrick-widget-task/refs/heads/main/public/widget.js"
  integrity="${sriHashes.sha384}"
  crossorigin="anonymous"
  async>
</script>`);

// List all created files
console.log("\n📋 Created files:");
fs.readdirSync(BUILD_DIR).forEach((file) => {
  const filePath = path.join(BUILD_DIR, file);
  const stats = fs.statSync(filePath);
  console.log(`   ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
});

// Create SRI info file
const sriInfo = {
  version: WIDGET_VERSION,
  buildDate: new Date().toISOString(),
  fileSize: fs.statSync(path.join(BUILD_DIR, "widget.js")).size,
  hashes: sriHashes,
  integrationCode: {
    basic: `<div class="finnrick-rating" data-product-id="YOUR_PRODUCT_ID"></div>
<script src="https://raw.githubusercontent.com/publicinmogr/finnrick-widget-task/refs/heads/main/public/widget.js" async></script>`,
    secure: `<div class="finnrick-rating" data-product-id="YOUR_PRODUCT_ID"></div>
<script 
  src="https://raw.githubusercontent.com/publicinmogr/finnrick-widget-task/refs/heads/main/public/widget.js"
  integrity="${sriHashes.sha384}"
  crossorigin="anonymous"
  async>
</script>`,
  },
};

fs.writeFileSync(
  path.join(BUILD_DIR, "sri-info.json"),
  JSON.stringify(sriInfo, null, 2)
);
