const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch6Files = [
  'media_1786739183698.jpg',
  'media_1786739183997.jpg',
  'media_1786739183998.jpg',
  'media_1786739184000.jpg',
  'media_1786739184064.jpg'
];

async function processBatch6() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
  console.log('MongoDB Connected.');

  const ProductCategory = require('../models/ProductCategory');
  const Product = require('../models/Product');

  const catGifts = await ProductCategory.findOne({ slug: 'family-gift-boxes' });
  const catBeauty = await ProductCategory.findOne({ slug: 'beauty-fashion' });

  const productsData = [
    {
      file: batch6Files[0],
      outName: 'batch6_sunflower_roses_vase.jpg',
      name: 'Vibrant Sunflower & Red Rose Mixed Bouquet in Glass Vase',
      sku: 'PRD-GFT-32',
      category: catGifts._id,
      description: 'Freshly cut golden sunflowers and rich red roses arranged in a clear crystal glass vase for a bright celebratory gift.',
      short_description: 'Fresh golden sunflowers & red roses arrangement in clear glass vase.',
      price_coins: 35000,
      stock: 20,
      weight_kg: 2.5
    },
    {
      file: batch6Files[1],
      outName: 'batch6_skincare_coffee_tray.jpg',
      name: 'Luxury Skincare & Self-Care Gift Tray (Sulwhasoo, YSL Lipsticks, Candle & Coffee)',
      sku: 'PRD-BTY-33',
      category: catBeauty._id,
      description: 'Curated self-care aesthetic gift tray featuring Sulwhasoo toner, YSL lipsticks, Glow Recipe balm, scented candle & iced coffee.',
      short_description: 'Luxury aesthetic self-care gift tray with Sulwhasoo, YSL & candle.',
      price_coins: 120000,
      stock: 15,
      weight_kg: 2.0
    },
    {
      file: batch6Files[2],
      outName: 'batch6_white_center_rose.jpg',
      name: "Signature Red Roses Bouquet with Center White Rose & Baby's Breath",
      sku: 'PRD-GFT-34',
      category: catGifts._id,
      description: "Classic 24-stem red roses hand-tied bouquet featuring a single symbolic white rose center and delicate baby's breath trim.",
      short_description: "Classic 24 red roses bouquet with center white rose & baby's breath.",
      price_coins: 42000,
      stock: 30,
      weight_kg: 1.8
    },
    {
      file: batch6Files[3],
      outName: 'batch6_gucci_ysl_balloon_basket.jpg',
      name: 'Gucci Beauty & YSL Libre Luxury Birthday Balloon Gift Basket',
      sku: 'PRD-GFT-35',
      category: catGifts._id,
      description: 'Ultra-luxurious birthday gift hamper featuring Gucci Beauty cosmetics, YSL Libre perfume, red & white rose basket & custom helium balloon.',
      short_description: 'Gucci Beauty, YSL Libre perfume & rose basket with custom balloon.',
      price_coins: 250000,
      stock: 5,
      weight_kg: 5.0
    },
    {
      file: batch6Files[4],
      outName: 'batch6_heart_balloon_twin_bouquets.jpg',
      name: 'Happy Birthday Dual Heart Balloon & Twin Flower Bouquet Set',
      sku: 'PRD-GFT-36',
      category: catGifts._id,
      description: 'Celebration surprise set featuring 2 red heart foil balloons ("Happy Birthday" & "I Love You"), a red rose bouquet, a mixed wildflower bouquet & silver gift bag.',
      short_description: '2 red heart balloons, red rose bouquet & mixed wildflower bouquet.',
      price_coins: 48000,
      stock: 25,
      weight_kg: 3.2
    }
  ];

  for (const item of productsData) {
    const srcPath = path.join(userUploadedDir, item.file);
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
  console.log('Batch 6 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch6().catch(err => {
  console.error(err);
  process.exit(1);
});
