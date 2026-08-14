const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch1Files = [
  'media_1786737403453.jpg',
  'media_1786737403458.jpg',
  'media_1786737403460.jpg',
  'media_1786737403472.jpg',
  'media_1786737403767.jpg'
];

async function processBatch1() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
  console.log('MongoDB Connected.');

  const ProductCategory = require('../models/ProductCategory');
  const Product = require('../models/Product');

  const catAdultToys = await ProductCategory.findOne({ slug: 'adult-toys' }) || 
    await ProductCategory.create({ name: 'Adult Toys', slug: 'adult-toys', description: 'Adult toys, intimacy products, vibrators, and adult wellness accessories' });

  const catJewelry = await ProductCategory.findOne({ slug: 'jewelry-accessories' }) || 
    await ProductCategory.create({ name: 'Jewelry & Fine Accessories', slug: 'jewelry-accessories', description: 'Gold engagement rings, necklaces, earrings, and couple promise rings' });

  const productsData = [
    {
      file: batch1Files[0],
      outName: 'batch1_bdsm_kit.jpg',
      name: 'Deluxe BDSM & Bondage Restraint Kit (Whips, Handcuffs, Clamps & Probes)',
      sku: 'PRD-TOY-07',
      category: catAdultToys._id,
      description: 'Comprehensive adult play starter kit featuring a leather flogger, spanking paddle, plush furry handcuffs, feather nipple clamps, inflatable pump plug, prostate massager, kegel balls, and restraint straps.',
      short_description: 'Deluxe adult bondage set with flogger, handcuffs, nipple clamps & probes.',
      price_coins: 35000,
      stock: 35,
      weight_kg: 1.2
    },
    {
      file: batch1Files[1],
      outName: 'batch1_silver_nipple_chain.jpg',
      name: 'Non-Piercing Silver Box-Chain Nipple Clamps with Carved Bead',
      sku: 'PRD-TOY-08',
      category: catAdultToys._id,
      description: 'Adjustable clip-on non-piercing nipple chain with carved vintage silver alloy bead ornament. Body-safe stainless steel construction.',
      short_description: 'Adjustable non-piercing silver box-chain nipple clip ornament.',
      price_coins: 12500,
      stock: 50,
      weight_kg: 0.15
    },
    {
      file: batch1Files[2],
      outName: 'batch1_intimacy_chain_ring.jpg',
      name: 'Vintage Carved Silver Bead Intimacy Chain & Shaft Ring',
      sku: 'PRD-TOY-09',
      category: catAdultToys._id,
      description: 'Intimacy enhancement box-chain ring featuring an intricate carved vintage silver alloy bead for sensory stimulation.',
      short_description: 'Stainless steel box-chain intimacy ring with carved silver bead.',
      price_coins: 10500,
      stock: 45,
      weight_kg: 0.1
    },
    {
      file: batch1Files[3],
      outName: 'batch1_body_chain_jewelry.jpg',
      name: 'Adjustable Non-Piercing Body Chain Jewelry with Vintage Bead',
      sku: 'PRD-JWL-10',
      category: catJewelry._id,
      description: 'Elegant non-piercing clip-on body chain jewelry crafted from stainless steel box chain with an antique carved scroll accent bead.',
      short_description: 'Stainless steel clip-on body chain with carved scroll accent bead.',
      price_coins: 11500,
      stock: 40,
      weight_kg: 0.12
    },
    {
      file: batch1Files[4],
      outName: 'batch1_enhancement_ring.jpg',
      name: 'Textured Carved Silver Enhancement Ring Chain',
      sku: 'PRD-TOY-11',
      category: catAdultToys._id,
      description: 'Multi-use stainless steel box-chain enhancement ring with carved accent bead designed for intimate accessories and adult play.',
      short_description: 'Multi-use stainless steel box-chain enhancement ring.',
      price_coins: 9500,
      stock: 55,
      weight_kg: 0.1
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
  console.log('Batch 1 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch1().catch(err => {
  console.error(err);
  process.exit(1);
});
