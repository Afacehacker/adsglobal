const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch4Files = [
  'media_1786738736799.jpg',
  'media_1786738737065.jpg',
  'media_1786738737066.jpg',
  'media_1786738737080.jpg',
  'media_1786738737082.jpg'
];

async function processBatch4() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
  console.log('MongoDB Connected.');

  const ProductCategory = require('../models/ProductCategory');
  const Product = require('../models/Product');

  const catJewelry = await ProductCategory.findOne({ slug: 'jewelry-accessories' });
  const catGifts = await ProductCategory.findOne({ slug: 'family-gift-boxes' });
  const catPerfumes = await ProductCategory.findOne({ slug: 'perfumes-fragrances' });

  const productsData = [
    {
      file: batch4Files[0],
      outName: 'batch4_gold_anklet.jpg',
      name: 'Minimalist 18K Gold Plated Beaded Snake-Chain Anklet',
      sku: 'PRD-JWL-22',
      category: catJewelry._id,
      description: 'Dainty 18K gold-plated snake-chain anklet featuring fixed polished gold accent beads. Water-resistant and tarnish-free alloy.',
      short_description: 'Dainty 18K gold-plated snake-chain anklet with gold accent beads.',
      price_coins: 8500,
      stock: 60,
      weight_kg: 0.05
    },
    {
      file: batch4Files[1],
      outName: 'batch4_red_roses_bouquet.jpg',
      name: 'Fresh Luxury Long-Stem Red Roses Bouquet (12 Stems)',
      sku: 'PRD-GFT-23',
      category: catGifts._id,
      description: 'Freshly harvested long-stem premium red roses (12 stems) beautifully wrapped in clear floral sleeve with satin ribbon.',
      short_description: 'Freshly harvested long-stem 12 red roses bouquet with satin ribbon.',
      price_coins: 25000,
      stock: 40,
      weight_kg: 1.5
    },
    {
      file: batch4Files[2],
      outName: 'batch4_cr7_pendant.jpg',
      name: 'Cristiano Ronaldo CR7 #7 Iced Football Jersey Pendant & Gold Chain',
      sku: 'PRD-JWL-24',
      category: catJewelry._id,
      description: 'Iced cubic zirconia gold-plated CR7 #7 football jersey pendant necklace for sports lovers and football fans.',
      short_description: 'Iced cubic zirconia gold-plated CR7 #7 football jersey pendant necklace.',
      price_coins: 22000,
      stock: 35,
      weight_kg: 0.2
    },
    {
      file: batch4Files[3],
      outName: 'batch4_regal_flower_hatbox.jpg',
      name: 'Regal Signature Luxury Velvet Hatbox Mixed Rose Flower Arrangement',
      sku: 'PRD-GFT-25',
      category: catGifts._id,
      description: 'Grand velvet round hatbox filled with over 35 fresh mixed red, yellow, white, and pink roses with diamond accent ribbon bow.',
      short_description: 'Grand velvet hatbox filled with 35+ fresh mixed color roses.',
      price_coins: 65000,
      stock: 15,
      weight_kg: 3.0
    },
    {
      file: batch4Files[4],
      outName: 'batch4_amouage_perfumes.jpg',
      name: 'Amouage Luxury Niche Eau de Parfum Duo (Purpose & Jubilation 40 - 100ml)',
      sku: 'PRD-PRF-26',
      category: catPerfumes._id,
      description: 'Authentic 100ml luxury designer niche perfume bottles from Amouage Oman fragrance collection (Purpose EDP & Jubilation 40 Extrait).',
      short_description: 'Authentic 100ml luxury designer niche perfumes from Amouage.',
      price_coins: 280000,
      stock: 10,
      weight_kg: 0.8
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
  console.log('Batch 4 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch4().catch(err => {
  console.error(err);
  process.exit(1);
});
