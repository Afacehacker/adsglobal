const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch2Files = [
  'media_1786737887072.jpg',
  'media_1786737887074.jpg',
  'media_1786737887290.jpg',
  'media_1786737887293.jpg',
  'media_1786737887298.jpg'
];

async function processBatch2() {
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
      file: batch2Files[0],
      outName: 'batch2_boxchain_display.jpg',
      name: 'Adjustable Non-Piercing Silver Box-Chain Clip Earrings & Chain',
      sku: 'PRD-JWL-12',
      category: catJewelry._id,
      description: 'Handcrafted non-piercing clip-on silver box chain with antique carved cylinder bead ornament on display card.',
      short_description: 'Non-piercing clip-on silver box chain with antique carved bead.',
      price_coins: 11000,
      stock: 45,
      weight_kg: 0.1
    },
    {
      file: batch2Files[1],
      outName: 'batch2_stainless_clip_chain.jpg',
      name: 'Body-Safe Stainless Steel Clip-On Intimacy Chain & Scroll Bead',
      sku: 'PRD-TOY-13',
      category: catAdultToys._id,
      description: 'Versatile clip-on stainless steel sensory chain featuring vintage scroll bead ornament for non-piercing body attachment.',
      short_description: 'Clip-on stainless steel sensory chain with vintage scroll bead.',
      price_coins: 12000,
      stock: 50,
      weight_kg: 0.12
    },
    {
      file: batch2Files[2],
      outName: 'batch2_leather_collar_leash.jpg',
      name: 'Deluxe Leather Restraint Collar & Metal Leash Set',
      sku: 'PRD-TOY-14',
      category: catAdultToys._id,
      description: 'Premium black textured faux leather restraint collar with heavy silver-tone chain leash, D-ring attachment, and padded handle.',
      short_description: 'Adjustable black leather collar with silver-tone chain leash.',
      price_coins: 18500,
      stock: 35,
      weight_kg: 0.45
    },
    {
      file: batch2Files[3],
      outName: 'batch2_wide_choker_leash.jpg',
      name: 'Luxury Wide Leather Choker Collar & Hanging Leash Chain',
      sku: 'PRD-TOY-15',
      category: catAdultToys._id,
      description: 'Wide adjustable black leather choker collar with detachable stainless steel hanging chain leash for gothic bondage play.',
      short_description: 'Wide black leather choker collar with detachable chain leash.',
      price_coins: 22000,
      stock: 30,
      weight_kg: 0.5
    },
    {
      file: batch2Files[4],
      outName: 'batch2_parachute_rings_set.jpg',
      name: 'Leather Parachute Ball Stretcher & 3-Piece Bead Ring Set',
      sku: 'PRD-TOY-16',
      category: catAdultToys._id,
      description: 'Studded leather weight parachute ball stretcher strap with stainless steel link chain, paired with 3 beaded silicone restriction rings.',
      short_description: 'Studded leather parachute ball stretcher & 3 beaded silicone rings.',
      price_coins: 16500,
      stock: 40,
      weight_kg: 0.35
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
  console.log('Batch 2 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch2().catch(err => {
  console.error(err);
  process.exit(1);
});
