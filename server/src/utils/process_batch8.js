const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userUploadedDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4e72e7f2-1512-4cc3-b1ef-00765ec9d1fc\\.user_uploaded';
const clientImgDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\client\\public\\images\\uploads';
const serverUploadDir = 'c:\\Users\\HP\\OneDrive\\Desktop\\adsglobal\\server\\uploads';

if (!fs.existsSync(clientImgDir)) fs.mkdirSync(clientImgDir, { recursive: true });
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true });

const batch8Files = [
  'media_1786740374405.jpg',
  'media_1786740374411.jpg',
  'media_1786740374413.jpg',
  'media_1786740374416.jpg',
  'media_1786740374429.jpg'
];

async function processBatch8() {
  await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
  console.log('MongoDB Connected.');

  const ProductCategory = require('../models/ProductCategory');
  const Product = require('../models/Product');

  const catFastFood = await ProductCategory.findOne({ slug: 'fast-food-express' });

  const productsData = [
    {
      file: batch8Files[0],
      outName: 'batch8_texmex_double_burger.jpg',
      name: 'Tex-Mex Double Bacon Cheeseburger with Guacamole & Crispy Nachos',
      sku: 'PRD-FF-42',
      category: catFastFood._id,
      description: 'Double flame-grilled beef patties topped with crispy bacon, melted cheddar, guacamole & crunchy tortilla chips on a sesame seed bun.',
      short_description: 'Double beef patties, bacon, cheddar, guacamole & crunchy nachos.',
      price_coins: 14500,
      stock: 35,
      weight_kg: 0.55
    },
    {
      file: batch8Files[1],
      outName: 'batch8_bigmac_spicy_nuggets.jpg',
      name: 'Big Mac Twin Burger & Spicy Chicken Nuggets Express Meal',
      sku: 'PRD-FF-43',
      category: catFastFood._id,
      description: '2 iconic Big Mac double beef burgers paired with 6-piece spicy chicken nuggets box and large golden french fries.',
      short_description: '2 Big Mac burgers, 6-piece spicy chicken nuggets & large fries.',
      price_coins: 22000,
      stock: 25,
      weight_kg: 1.5
    },
    {
      file: batch8Files[2],
      outName: 'batch8_10pc_nuggets_meal.jpg',
      name: '10-Piece Golden Chicken Nuggets Meal Box with Fries & Soda',
      sku: 'PRD-FF-44',
      category: catFastFood._id,
      description: '10-piece crispy golden fried chicken nuggets served with large french fries, dipping sauce and cold soft drink cup.',
      short_description: '10 crispy chicken nuggets, large fries, dip & soft drink.',
      price_coins: 12500,
      stock: 45,
      weight_kg: 0.8
    },
    {
      file: batch8Files[3],
      outName: 'batch8_mcspaghetti_meal.jpg',
      name: 'McSpaghetti Italian Meat Sauce Pasta Meal Box',
      sku: 'PRD-FF-45',
      category: catFastFood._id,
      description: 'Al dente spaghetti noodles tossed in rich sweet Italian tomato meat sauce topped with grated cheddar cheese.',
      short_description: 'Al dente spaghetti tossed in rich sweet tomato meat sauce.',
      price_coins: 10000,
      stock: 30,
      weight_kg: 0.7
    },
    {
      file: batch8Files[4],
      outName: 'batch8_classic_cheeseburger_fries.jpg',
      name: 'Classic Flame-Grilled Beef Cheeseburger & Fries Combo',
      sku: 'PRD-FF-46',
      category: catFastFood._id,
      description: 'Juicy flame-grilled beef patty with fresh lettuce, mayo & melted cheese on a sesame seed bun served with golden french fries.',
      short_description: 'Flame-grilled beef burger with fresh lettuce, mayo & fries.',
      price_coins: 9500,
      stock: 50,
      weight_kg: 0.6
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
  console.log('Batch 8 successfully saved and listed on Marketplace!');
  process.exit(0);
}

processBatch8().catch(err => {
  console.error(err);
  process.exit(1);
});
