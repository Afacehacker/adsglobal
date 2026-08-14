const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch3Files = [
  'media_1786738050488.jpg',
  'media_1786738050593.jpg',
  'media_1786738050594.jpg',
  'media_1786738050601.jpg',
  'media_1786738050706.jpg'
];

async function processBatch3() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
  console.log('MongoDB Connected.');

  const ProductCategory = require('../models/ProductCategory');
  const Product = require('../models/Product');

  const catAdultToys = await ProductCategory.findOne({ slug: 'adult-toys' });
  const catJewelry = await ProductCategory.findOne({ slug: 'jewelry-accessories' });

  const productsData = [
    {
      file: batch3Files[0],
      outName: 'batch3_gold_panther_chain.jpg',
      name: 'Luxury 18K Gold Plated Panther Pendant & Cuban Link Chain',
      sku: 'PRD-JWL-17',
      category: catJewelry._id,
      description: 'High-polish statement 18K gold-plated 3D panther pendant attached to a heavy Cuban link chain necklace.',
      short_description: '18K gold plated 3D panther pendant with thick Cuban link chain.',
      price_coins: 45000,
      stock: 25,
      weight_kg: 0.35
    },
    {
      file: batch3Files[1],
      outName: 'batch3_rubber_nipple_clamps.jpg',
      name: 'Stainless Steel Adjustable Rubber-Tip Nipple Clamp Chain',
      sku: 'PRD-TOY-18',
      category: catAdultToys._id,
      description: 'Body-safe stainless steel nipple clamp chain featuring protective rubber tips and adjustable tension screws for sensory play.',
      short_description: 'Stainless steel nipple clamp chain with protective rubber tips.',
      price_coins: 11500,
      stock: 60,
      weight_kg: 0.15
    },
    {
      file: batch3Files[2],
      outName: 'batch3_soldier_pendant_trio.jpg',
      name: 'Military Soldier Action Figurine Pendant Ball Chain Set (Black, Silver, Gold)',
      sku: 'PRD-JWL-19',
      category: catJewelry._id,
      description: 'Unique 3-piece set of stainless steel standing military soldier pendants on matching ball chains in Black, Silver, and Gold finishes.',
      short_description: '3-piece military soldier figurine pendant ball chain set.',
      price_coins: 25000,
      stock: 30,
      weight_kg: 0.25
    },
    {
      file: batch3Files[3],
      outName: 'batch3_iced_jesus_piece.jpg',
      name: 'Iced-Out Silver Cubic Zirconia Jesus Piece & Cuban Chain',
      sku: 'PRD-JWL-20',
      category: catJewelry._id,
      description: 'Premium silver iced-out Jesus head pendant encrusted with AAA cubic zirconia stones on a matching iced Miami Cuban link necklace.',
      short_description: 'Full CZ iced-out silver Jesus head pendant on Miami Cuban link chain.',
      price_coins: 65000,
      stock: 15,
      weight_kg: 0.4
    },
    {
      file: batch3Files[4],
      outName: 'batch3_gold_charm_bundle.jpg',
      name: '5-Piece Gold Charm Pendant Necklace Collection (Anchor, Cross, Bear, Ankh & Coin)',
      sku: 'PRD-JWL-21',
      category: catJewelry._id,
      description: 'Curated 5-piece gold-plated box-chain necklace collection featuring Anchor, Medusa Coin, Iced Cross, Teddy Bear, and Ankh Key charm pendants.',
      short_description: 'Curated 5-piece gold-plated box-chain necklace bundle.',
      price_coins: 38000,
      stock: 20,
      weight_kg: 0.5
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
  console.log('Batch 3 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch3().catch(err => {
  console.error(err);
  process.exit(1);
});
