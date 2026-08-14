const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const tempDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\tempmediaStorage';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch5Files = [
  'media_1786738950836.jpg',
  'media_1786738950876.jpg',
  'media_1786738950890.jpg',
  'media_1786738950894.jpg',
  'media_1786738950890.jpg' // duplicate media for 5th item variant
];

async function processBatch5() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
  console.log('MongoDB Connected.');

  const ProductCategory = require('../models/ProductCategory');
  const Product = require('../models/Product');

  const catGifts = await ProductCategory.findOne({ slug: 'family-gift-boxes' });

  const productsData = [
    {
      file: batch5Files[0],
      outName: 'batch5_50_red_roses.jpg',
      name: 'Grand 50-Stem Luxury Red Roses Arm-Bouquet',
      sku: 'PRD-GFT-27',
      category: catGifts._id,
      description: 'Extra large arm-bouquet of 50 fresh premium long-stem red roses tied with red satin ribbon for grand surprises.',
      short_description: 'Grand arm-bouquet of 50 fresh long-stem red roses.',
      price_coins: 85000,
      stock: 15,
      weight_kg: 4.0
    },
    {
      file: batch5Files[1],
      outName: 'batch5_letterbox_white_roses.jpg',
      name: 'Letterbox White Roses & Wildflower Floral Gift Box with Glass Vase',
      sku: 'PRD-GFT-28',
      category: catGifts._id,
      description: 'Curated white roses and pastel wildflower arrangement with letterbox protective gift packaging and clear glass vase.',
      short_description: 'White roses & wildflower bouquet with letterbox packaging & vase.',
      price_coins: 32000,
      stock: 25,
      weight_kg: 2.0
    },
    {
      file: batch5Files[2],
      outName: 'batch5_moet_teddy_hamper.jpg',
      name: 'Ultimate Romance Gift Hamper (Moët Champagne, Teddy Bear, Red Roses & Chocolates)',
      sku: 'PRD-GFT-29',
      category: catGifts._id,
      description: 'VIP luxury romantic gift bundle featuring Moët & Chandon Imperial Champagne, large plush teddy bear, red rose velvet hatbox & 3 Pergale chocolate boxes.',
      short_description: 'VIP romantic hamper with Moët champagne, teddy bear, rose box & chocolates.',
      price_coins: 165000,
      stock: 10,
      weight_kg: 5.5
    },
    {
      file: batch5Files[3],
      outName: 'batch5_moet_ferrero_box.jpg',
      name: 'Regal Red Rose Hatbox with Moët & Chandon Champagne & Ferrero Rocher Set',
      sku: 'PRD-GFT-30',
      category: catGifts._id,
      description: 'Luxury red roses round velvet hatbox paired with Moët & Chandon Imperial Champagne bottle and 2 Ferrero Rocher chocolate packs.',
      short_description: 'Red roses velvet hatbox with Moët champagne & 2 Ferrero Rocher packs.',
      price_coins: 145000,
      stock: 12,
      weight_kg: 4.5
    },
    {
      file: batch5Files[4],
      outName: 'batch5_deluxe_anniversary_hamper.jpg',
      name: 'VIP Anniversary & Birthday Deluxe Champagne Rose Hamper',
      sku: 'PRD-GFT-31',
      category: catGifts._id,
      description: 'Deluxe celebratory romantic gift hamper featuring Moët & Chandon Champagne, jumbo teddy bear holding heart, rose hatbox with butterfly & 3 chocolate boxes.',
      short_description: 'Deluxe celebration hamper with Moët, jumbo teddy bear & chocolates.',
      price_coins: 175000,
      stock: 8,
      weight_kg: 6.0
    }
  ];

  for (const item of productsData) {
    let srcPath = path.join(userUploadedDir, item.file);
    if (!fs.existsSync(srcPath)) {
      srcPath = path.join(tempDir, item.file);
    }

    const destClient = path.join(clientImgDir, item.outName);
    const destServer = path.join(serverUploadDir, item.outName);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destClient);
      fs.copyFileSync(srcPath, destServer);
      console.log(`Copied ${item.file} -> ${item.outName}`);
    }

    const relImagePath = `/images/uploads/${item.outName}`;
    const uploadImagePath = `/uploads/${item.outName}`;

    await Product.findOneAndUpdate(
      { sku: item.sku },
      {
        name: item.name,
        sku: item.sku,
        category: item.category,
        description: item.description,
        short_description: item.short_description,
        price_coins: item.price_coins,
        images: [relImagePath, uploadImagePath],
        stock: item.stock,
        weight_kg: item.weight_kg,
        active: true,
        featured: true
      },
      { upsert: true, new: true }
    );

    console.log(`Saved product: [${item.sku}] ${item.name} - ₦${item.price_coins.toLocaleString()}`);
  }

  await mongoose.disconnect();
  console.log('Batch 5 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch5().catch(err => {
  console.error(err);
  process.exit(1);
});
