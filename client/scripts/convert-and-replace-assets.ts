import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Replace __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, "..", "src", "assets");

// Function to process directories recursively
const processDirectory = (dir: string) => {
  fs.readdirSync(dir).forEach(async (file) => {
    const fullPath = path.join(dir, file);
    
    // If it's a directory, process it recursively
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } 
    // If it's an image file, convert it
    else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      const outputPath = path.join(dir, `${path.parse(file).name}.webp`);

      try {
        await sharp(fullPath).webp({ quality: 80 }).toFile(outputPath);
        console.log(`✅ Converted: ${fullPath} → ${outputPath}`);
        fs.unlinkSync(fullPath); // delete the original
        console.log(`🗑️ Deleted original: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Error converting ${fullPath}:`, err);
      }
    }
  });
};

console.log(`Starting image conversion in ${assetsDir}...`);
processDirectory(assetsDir);
