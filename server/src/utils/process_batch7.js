const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch7Files = [
  'media_1786739697432.jpg',
  'media_1786739697436.jpg',
  'media_1786739697527.jpg',
  'media_1786739697532.jpg',
  'media_1786739697546.jpg'
];

async function processBatch7() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
  console.log('MongoDB Connected.');

  const ProductCategory = require('../models/ProductCategory');
  const Product = require('../models/Product');

  const catFastFood = await ProductCategory.findOne({ slug: 'fast-food-express' });

  const productsData = [
    {
      file: batch7Files[0],
      outName: 'batch7_falafel_wraps.jpg',
      name: 'Crispy Falafel & Cheese Pita Wrap Twin Pack',
      sku: 'PRD-FF-37',
      category: catFastFood._id,
      description: 'Golden fried falafel balls wrapped in warm toasted pita with shredded lettuce, melted cheddar cheese, and garlic tzatziki sauce.',
      short_description: 'Golden fried falafel wrapped in toasted pita with lettuce & cheese.',
      price_coins: 9500,
      stock: 40,
      weight_kg: 0.6
    },
    {
      file: batch7Files[1],
      outName: 'batch7_chicken_nuggets.jpg',
      name: 'Golden Crispy Chicken Nuggets (6-Piece Box & Dip)',
      sku: 'PRD-FF-38',
      category: catFastFood._id,
      description: 'Tender 100% white meat golden fried chicken nuggets served in a takeout box with signature savory dipping sauce.',
      short_description: 'Tender 100% white meat golden fried chicken nuggets with dip.',
      price_coins: 8000,
      stock: 50,
      weight_kg: 0.35
    },
    {
      file: batch7Files[2],
      outName: 'batch7_ultimate_feast_combo.jpg',
      name: 'Ultimate Express Feast Deluxe Fast Food Combo (2 Burgers, Nuggets, Fries, Ice Cream & Shake)',
      sku: 'PRD-FF-39',
      category: catFastFood._id,
      description: 'Mega fast food combo set featuring McCrispy burger, double cheeseburger, chicken nuggets, french fries, McFlurry, hot apple pie & chocolate milkshake.',
      short_description: 'Mega fast food combo with McCrispy, cheeseburger, nuggets, fries & desserts.',
      price_coins: 28000,
      stock: 20,
      weight_kg: 2.2
    },
    {
      file: batch7Files[3],
      outName: 'batch7_mccrispy_burger.jpg',
      name: 'McCrispy Spicy Fried Chicken Fillet Brioche Burger',
      sku: 'PRD-FF-40',
      category: catFastFood._id,
      description: 'Crispy seasoned fried chicken breast fillet served on a toasted buttered brioche bun with crinkle-cut pickles.',
      short_description: 'Crispy fried chicken breast fillet on toasted butter brioche bun.',
      price_coins: 11000,
      stock: 45,
      weight_kg: 0.45
    },
    {
      file: batch7Files[4],
      outName: 'batch7_international_menu_grid.jpg',
      name: 'International Express Menu Favorites Sampler (Burgers, Macarons, Wraps & Pies)',
      sku: 'PRD-FF-41',
      category: catFastFood._id,
      description: 'Global favorite menu sampler featuring specialty burgers, breakfast wraps, mozzarella sticks, empanadas & sweet macarons.',
      short_description: 'Global favorite menu sampler featuring burgers, wraps & macarons.',
      price_coins: 35000,
      stock: 15,
      weight_kg: 3.0
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
  console.log('Batch 7 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch7().catch(err => {
  console.error(err);
  process.exit(1);
});
