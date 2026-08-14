const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/adsglobal');
    console.log('Connected to MongoDB.');

    const ProductCategory = require('../models/ProductCategory');
    const Product = require('../models/Product');

    const cat = await ProductCategory.findOne({ slug: 'adult-toys' });
    console.log('Adult Toys Category:', cat ? `${cat.name} (ID: ${cat._id})` : 'NOT FOUND');

    if (cat) {
      const items = await Product.find({ category: cat._id });
      console.log(`Found ${items.length} listed Adult Toys:`);
      items.forEach((p, idx) => {
        console.log(`${idx + 1}. [${p.sku}] ${p.name}`);
        console.log(`   Price: ₦${p.price_coins.toLocaleString()} NGN | Images: ${p.images.join(' , ')}`);
      });
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
