require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');
const DeliveryPricingRule = require('../models/DeliveryPricingRule');
const AdPlatform = require('../models/AdPlatform');
const AdPricingRule = require('../models/AdPricingRule');
const AdCampaign = require('../models/AdCampaign');
const AdminSetting = require('../models/AdminSetting');

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adsglobal';
    await mongoose.connect(connStr);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data (optional for fresh start)
    await User.deleteMany({});
    await Wallet.deleteMany({});
    await ProductCategory.deleteMany({});
    await Product.deleteMany({});
    await DeliveryPricingRule.deleteMany({});
    await AdPlatform.deleteMany({});
    await AdPricingRule.deleteMany({});
    await AdCampaign.deleteMany({});
    await AdminSetting.deleteMany({});

    console.log('Existing collections cleared.');

    // 1. Create Default Official Admin Account
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@adsglobal.com',
      phone: '+2348012345678',
      country: 'Nigeria',
      password: 'adminpassword2026',
      role: 'SUPER_ADMIN',
      emailVerified: true
    });
    await Wallet.create({ user: adminUser._id, balance: 1000000 }); // Admin wallet starting balance

    console.log('Official Admin account created successfully.');

    // 2. Create Admin Settings
    await AdminSetting.create([
      { key: 'bank_name', value: 'Access Bank Plc', description: 'Designated deposit bank name' },
      { key: 'account_name', value: 'ADSGLOBAL Log & Tech Ltd', description: 'Designated deposit account name' },
      { key: 'account_number', value: '0712345678', description: 'Designated deposit account number' },
      { key: 'deposit_instructions', value: 'Please transfer the exact Naira amount to the bank above. Ensure you include your username in the transfer reference note, and upload a clear screenshot of the debit alert or receipt.', description: 'Instructions displayed to the user during deposit request' },
      { key: 'minimum_deposit', value: 1000, description: 'Minimum allowed deposit amount in Naira' },
      { key: 'maximum_deposit', value: 10000000, description: 'Maximum allowed deposit amount in Naira' }
    ]);
    console.log('Admin settings created.');

    // 3. Create Categories
    const catFood = await ProductCategory.create({ name: 'Food & Groceries', slug: 'food-groceries', description: 'Prepackaged groceries and foodstuffs' });
    const catFastFood = await ProductCategory.create({ name: 'Fast Food & Express Meals', slug: 'fast-food-express', description: 'Hot pizza, burgers, fried chicken, pasta, turkey, and drinks' });
    const catGifts = await ProductCategory.create({ name: 'Family Gift Boxes', slug: 'family-gift-boxes', description: 'Premium curated gift packages for occasions' });
    const catJewelry = await ProductCategory.create({ name: 'Jewelry & Fine Accessories', slug: 'jewelry-accessories', description: 'Gold engagement rings, necklaces, earrings, and couple promise rings' });
    const catPerfumes = await ProductCategory.create({ name: 'Perfumes & Luxury Fragrances', slug: 'perfumes-fragrances', description: 'Original designer perfumes, colognes, and body mists' });
    const catBeauty = await ProductCategory.create({ name: 'Beauty & Fashion', slug: 'beauty-fashion', description: 'Cosmetics, clothing, shoes and fashion' });
    const catTech = await ProductCategory.create({ name: 'Electronics & Tech', slug: 'electronics-tech', description: 'Smartphones, laptops, and gadgets' });
    const catAuto = await ProductCategory.create({ name: 'Automotive & Vehicles', slug: 'automotive-vehicles', description: 'Vehicle parts, EV chargers, and car accessories' });
    const catHome = await ProductCategory.create({ name: 'Home & Living', slug: 'home-living', description: 'Home decor, furniture, pillows, frames and comfort' });

    console.log('Product categories created.');

    // 4. Create Real Life Marketplace Products (25% Discount Applied Across All 9 Categories)
    await Product.create([
      // --- 1. FAST FOOD & EXPRESS MEALS ---
      {
        name: 'Coca-Cola Classic Soda Cans (12 Pack - 355ml)',
        sku: 'PRD-FF-01',
        category: catFastFood._id,
        description: 'Original Coca-Cola taste in a convenient 12-can fridge pack. Refreshing carbonated soft drink.',
        short_description: 'Coca-Cola Classic 12-can fridge pack.',
        price_coins: 11250,
        images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500'],
        stock: 80,
        weight_kg: 4.5,
        dimensions: { length_cm: 40, width_cm: 15, height_cm: 13 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Hellmann\'s Real Mayonnaise (30 fl oz Jar)',
        sku: 'PRD-GRO-02',
        category: catFastFood._id,
        description: 'Made with 100% cage-free eggs, oil, and vinegar. The classic American creamy mayo condiment for sandwiches, burgers, and dips.',
        short_description: 'Hellmann\'s Real Mayonnaise 30 oz jar.',
        price_coins: 12000,
        images: ['https://images.unsplash.com/photo-1528751014936-863e6e7a31f0?w=500'],
        stock: 75,
        weight_kg: 1.0,
        dimensions: { length_cm: 15, width_cm: 10, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Double Bacon Cheeseburger & Crispy French Fries Meal',
        sku: 'PRD-FF-03',
        category: catFastFood._id,
        description: 'Two 100% Angus beef patties, melted American cheese, crispy smoked bacon, lettuce, tomatoes, secret sauce on a toasted brioche bun with seasoned golden fries.',
        short_description: 'Double Angus bacon cheeseburger & fries meal.',
        price_coins: 13125,
        images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'],
        stock: 60,
        weight_kg: 1.2,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 12 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Krispy Kreme Original Glazed Donuts Box (12 Pack)',
        sku: 'PRD-FF-04',
        category: catFastFood._id,
        description: 'One dozen freshly made light and fluffy signature original glazed donuts.',
        short_description: 'Krispy Kreme Original Glazed Donuts (12 Pack).',
        price_coins: 13500,
        images: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500'],
        stock: 50,
        weight_kg: 1.1,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Creamy Chicken Fettuccine Alfredo & Garlic Bread',
        sku: 'PRD-FF-05',
        category: catFastFood._id,
        description: 'Tender grilled chicken breast served over al dente fettuccine pasta in a rich, buttery parmesan cream sauce with toasted garlic herb bread.',
        short_description: 'Creamy fettuccine alfredo pasta & garlic bread.',
        price_coins: 14625,
        images: ['https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500'],
        stock: 40,
        weight_kg: 1.4,
        dimensions: { length_cm: 26, width_cm: 20, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Large Pepperoni Pizza & 2L Coca-Cola Bottle Combo',
        sku: 'PRD-FF-06',
        category: catFastFood._id,
        description: 'Freshly baked 14" hand-tossed crust topped with rich tomato sauce, melted mozzarella cheese, premium beef pepperoni slices, served with an ice-cold 2L Coca-Cola.',
        short_description: 'Large 14" Pepperoni Pizza with 2L Coca-Cola bottle.',
        price_coins: 15000,
        images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'],
        stock: 50,
        weight_kg: 1.8,
        dimensions: { length_cm: 36, width_cm: 36, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Golden Deep-Fried Seasoned Turkey Wings & Drumsticks (4 Pcs)',
        sku: 'PRD-FF-07',
        category: catFastFood._id,
        description: 'Jumbo turkey wings and drumsticks marinated in spicy paprika herb brine, deep fried to golden perfection with a side of pepper dipping sauce.',
        short_description: 'Golden fried seasoned turkey wings & drumsticks.',
        price_coins: 16125,
        images: ['https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500'],
        stock: 35,
        weight_kg: 2.0,
        dimensions: { length_cm: 30, width_cm: 22, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Crispy Golden Fried Chicken & Chips Bucket (12 Pcs)',
        sku: 'PRD-FF-08',
        category: catFastFood._id,
        description: '12 pieces of secret 11-herb extra crispy fried chicken legs and thighs, served with a large family size tub of seasoned potato chips and coleslaw.',
        short_description: '12-piece crispy fried chicken & chips bucket.',
        price_coins: 16500,
        images: ['https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500'],
        stock: 45,
        weight_kg: 2.5,
        dimensions: { length_cm: 28, width_cm: 28, height_cm: 20 },
        package_type: 'box',
        fragile: false,
        featured: true
      },

      // --- 2. FAMILY GIFT BOXES ---
      {
        name: 'Custom Photo Coffee Mug & Electric Warmer Kit',
        sku: 'PRD-GIF-09',
        category: catGifts._id,
        description: 'Ceramic photo mug personalized with your picture, paired with a smart desktop mug warming pad that maintains 55°C.',
        short_description: 'Custom photo mug and mug warmer kit.',
        price_coins: 18750,
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'],
        stock: 50,
        weight_kg: 0.9,
        dimensions: { length_cm: 20, width_cm: 15, height_cm: 12 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Personalized Engraved Wooden Memory Keepsake Box',
        sku: 'PRD-GIF-10',
        category: catGifts._id,
        description: 'Handcrafted mahogany memory box engraved with custom family names or wedding anniversary dates.',
        short_description: 'Engraved wooden memory keepsake box.',
        price_coins: 20250,
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=500'],
        stock: 25,
        weight_kg: 1.4,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Gourmet Bamboo Cheese Board & Knife Set Gift Box',
        sku: 'PRD-GIF-11',
        category: catGifts._id,
        description: '100% natural organic bamboo charcuterie board with hidden slide-out drawer containing 4 stainless steel cheese knives & ceramic bowls.',
        short_description: 'Bamboo Charcuterie Board & Knife Gift Set.',
        price_coins: 22125,
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=500'],
        stock: 35,
        weight_kg: 2.1,
        dimensions: { length_cm: 34, width_cm: 34, height_cm: 6 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Godiva Chocolatier Milk & Dark Chocolate Gift Box (36 Pc)',
        sku: 'PRD-GIF-12',
        category: catGifts._id,
        description: 'Assorted Belgian chocolates including praline noisette, dark ganache, milk caramel, and raspberry star.',
        short_description: 'Godiva Belgian Chocolate Gift Box (36 pc).',
        price_coins: 24000,
        images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
        stock: 45,
        weight_kg: 0.9,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Tea Forté Herbal Tea Tasting Chest Gift Set (40 Pyramids)',
        sku: 'PRD-GIF-13',
        category: catGifts._id,
        description: 'Signature tea chest containing 40 handcrafted silk pyramid tea infusers featuring green, black, herbal, and white teas.',
        short_description: 'Tea Forté Herbal Tea Tasting Chest Set.',
        price_coins: 26250,
        images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500'],
        stock: 25,
        weight_kg: 1.5,
        dimensions: { length_cm: 30, width_cm: 20, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Harry & David Deluxe Royal Riviera Pears Gift Box',
        sku: 'PRD-GIF-14',
        category: catGifts._id,
        description: 'Famous juicy Royal Riviera Pears hand-picked in Southern Oregon. Wrapped in gold foil inside a presentation keepsake gift box.',
        short_description: 'Harry & David Deluxe Royal Riviera Pears Box.',
        price_coins: 28500,
        images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500'],
        stock: 35,
        weight_kg: 3.5,
        dimensions: { length_cm: 35, width_cm: 28, height_cm: 12 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Fresh Red Roses & Lily Flower Bouquet Box',
        sku: 'PRD-GIF-15',
        category: catGifts._id,
        description: 'Exquisite fresh flower arrangement containing 24 long-stem red roses and stargazer lilies in a luxury gift box.',
        short_description: 'Luxury fresh flower bouquet gift box.',
        price_coins: 31500,
        images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500'],
        stock: 30,
        weight_kg: 1.8,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 20 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Hickory Farms Beef & Cheese Snack Gourmet Gift Basket',
        sku: 'PRD-GIF-16',
        category: catGifts._id,
        description: 'Signature Summer Sausage, Smoked Gouda cheese, Farmhouse Cheddar, Sweet Hot Mustard, and Crispy Toast Crackers.',
        short_description: 'Hickory Farms Gourmet Beef & Cheese Basket.',
        price_coins: 33750,
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'],
        stock: 30,
        weight_kg: 2.8,
        dimensions: { length_cm: 32, width_cm: 25, height_cm: 15 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // --- 3. ELECTRONICS & TECH ---
      {
        name: 'Logitech MX Master 3S Performance Wireless Mouse',
        sku: 'PRD-US-TEC-17',
        category: catTech._id,
        description: 'Quiet Clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, ergonomic thumb rest design.',
        short_description: 'Logitech MX Master 3S Wireless Mouse.',
        price_coins: 39000,
        images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'],
        stock: 35,
        weight_kg: 0.4,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Bose SoundLink Flex Bluetooth Portable Speaker',
        sku: 'PRD-US-TEC-18',
        category: catTech._id,
        description: 'State-of-the-art transducer design, PositionIQ technology, IP67 waterproof & dustproof, up to 12 hours charge.',
        short_description: 'Bose SoundLink Flex Waterproof Speaker.',
        price_coins: 41250,
        images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500'],
        stock: 30,
        weight_kg: 0.9,
        dimensions: { length_cm: 20, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Anker MagSafe Magnetic Portable Power Bank 10,000mAh',
        sku: 'PRD-US-TEC-19',
        category: catTech._id,
        description: 'Snap-and-go MagSafe wireless charging power bank for iPhone 15/14/13, built-in kickstand, USB-C 20W fast charging.',
        short_description: 'Anker 10k MagSafe Magnetic Power Bank.',
        price_coins: 43500,
        images: ['https://images.unsplash.com/photo-1609592424089-a2e6e339b33a?w=500'],
        stock: 50,
        weight_kg: 0.4,
        dimensions: { length_cm: 12, width_cm: 8, height_cm: 3 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Kindle Paperwhite 16GB (11th Generation)',
        sku: 'PRD-US-TEC-20',
        category: catTech._id,
        description: '6.8" display with thinner borders, adjustable warm light, up to 10 weeks of battery life, waterproof design.',
        short_description: 'Amazon Kindle Paperwhite 16GB E-Reader.',
        price_coins: 46500,
        images: ['https://images.unsplash.com/photo-1592496001020-d31bd8306a35?w=500'],
        stock: 35,
        weight_kg: 0.4,
        dimensions: { length_cm: 18, width_cm: 13, height_cm: 3 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Ring Video Doorbell Pro 2 (Hardwired)',
        sku: 'PRD-US-TEC-21',
        category: catTech._id,
        description: '1536p HD Head-to-Toe Video, 3D Motion Detection, Bird’s Eye View, Two-Way Talk with Audio+, and Built-In Alexa Greetings.',
        short_description: 'Ring Video Doorbell Pro 2 Security Camera.',
        price_coins: 51000,
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=500'],
        stock: 25,
        weight_kg: 0.6,
        dimensions: { length_cm: 16, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Google Nest Learning Thermostat 3rd Gen (Stainless Steel)',
        sku: 'PRD-US-TEC-22',
        category: catTech._id,
        description: 'Auto-schedules heating and cooling based on your habits, HVAC energy saver, phone app remote control, Alexa compatible.',
        short_description: 'Google Nest Smart Thermostat 3rd Gen.',
        price_coins: 56250,
        images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=500'],
        stock: 22,
        weight_kg: 0.7,
        dimensions: { length_cm: 12, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Apple AirPods Pro (2nd Generation) MagSafe USB-C',
        sku: 'PRD-US-TEC-23',
        category: catTech._id,
        description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, and USB-C MagSafe charging case.',
        short_description: 'Apple AirPods Pro 2nd Gen with USB-C.',
        price_coins: 63750,
        images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500'],
        stock: 40,
        weight_kg: 0.3,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Nintendo Switch OLED Model Console (White)',
        sku: 'PRD-US-TEC-24',
        category: catTech._id,
        description: 'Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port dock, 64 GB internal storage, and enhanced audio.',
        short_description: 'Nintendo Switch OLED Gaming Console.',
        price_coins: 71250,
        images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500'],
        stock: 18,
        weight_kg: 1.6,
        dimensions: { length_cm: 26, width_cm: 21, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        sku: 'PRD-US-TEC-25',
        category: catTech._id,
        description: 'Industry-leading noise cancelling with two processors and 8 microphones. 30-hour battery life and ultra-comfortable design.',
        short_description: 'Sony WH-1000XM5 premium ANC headphones.',
        price_coins: 86250,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        stock: 30,
        weight_kg: 0.8,
        dimensions: { length_cm: 24, width_cm: 22, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // --- 4. JEWELRY & FINE ACCESSORIES ---
      {
        name: 'Personalized Matching His & Hers Couple Promise Rings Set',
        sku: 'PRD-JWL-26',
        category: catJewelry._id,
        description: 'Titanium steel matching couple promise rings engraved with custom anniversary dates or names inside the bands.',
        short_description: 'Personalized His & Hers Couple Promise Rings.',
        price_coins: 19500,
        images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500'],
        stock: 45,
        weight_kg: 0.2,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 5 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: '18K Gold Plated Heart Pendant Necklace',
        sku: 'PRD-JWL-27',
        category: catJewelry._id,
        description: 'Dainty 18K real gold plated heart pendant on an adjustable 18-inch cable chain. Tarnish-resistant and hypoallergenic gift for her.',
        short_description: '18K Gold Plated Heart Pendant Necklace.',
        price_coins: 23250,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        stock: 35,
        weight_kg: 0.1,
        dimensions: { length_cm: 12, width_cm: 10, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Pandora Moments Sterling Silver Charm Bracelet',
        sku: 'PRD-JWL-28',
        category: catJewelry._id,
        description: 'Authentic 925 sterling silver snake chain charm bracelet with barrel clasp logo. Compatible with all Pandora charms.',
        short_description: 'Pandora Sterling Silver Charm Bracelet.',
        price_coins: 33000,
        images: ['https://images.unsplash.com/photo-1611591475281-b1e96467aa75?w=500'],
        stock: 30,
        weight_kg: 0.3,
        dimensions: { length_cm: 12, width_cm: 12, height_cm: 5 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: '14K Yellow Gold Diamond Huggie Hoop Earrings',
        sku: 'PRD-JWL-29',
        category: catJewelry._id,
        description: 'Classic 14K gold mini huggie hoop earrings embedded with 0.25 Ct sparkling lab-grown micro pavé diamonds. Secure snap closure.',
        short_description: '14K Gold Diamond Huggie Hoop Earrings.',
        price_coins: 54000,
        images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500'],
        stock: 25,
        weight_kg: 0.1,
        dimensions: { length_cm: 10, width_cm: 8, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: '14K Solid Gold Solitaire Diamond Engagement Ring',
        sku: 'PRD-JWL-30',
        category: catJewelry._id,
        description: '1.0 Carat round brilliant natural diamond set in a 4-prong 14K solid yellow gold band. Includes IGI jewelry certification certificate.',
        short_description: '14K Gold 1.0 Ct Solitaire Diamond Engagement Ring.',
        price_coins: 221250,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'],
        stock: 10,
        weight_kg: 0.2,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // --- 5. PERFUMES & LUXURY FRAGRANCES ---
      {
        name: 'Victoria\'s Secret Velvet Petals Mist & Lotion Gift Set',
        sku: 'PRD-PRF-31',
        category: catPerfumes._id,
        description: 'Lush floral fragrance mist (250ml) and body lotion (236ml) gift set with notes of lush blooms and almond glaze.',
        short_description: 'Victoria\'s Secret Velvet Petals Mist & Lotion Set.',
        price_coins: 25500,
        images: ['https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=500'],
        stock: 40,
        weight_kg: 0.8,
        dimensions: { length_cm: 20, width_cm: 15, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Giorgio Armani Acqua Di Giò Pour Homme (100ml)',
        sku: 'PRD-PRF-32',
        category: catPerfumes._id,
        description: 'Iconic aquatic cologne with bergamot, neroli, and green tangerine leading to sea notes and sweet jasmine.',
        short_description: 'Giorgio Armani Acqua Di Giò 100ml Cologne.',
        price_coins: 58500,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
        stock: 30,
        weight_kg: 0.6,
        dimensions: { length_cm: 15, width_cm: 10, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Yves Saint Laurent Black Opium Eau de Parfum (90ml)',
        sku: 'PRD-PRF-33',
        category: catPerfumes._id,
        description: 'Seductive warm gourmand fragrance with notes of black coffee, white flowers, and sweet vanilla. Iconic glitter black bottle.',
        short_description: 'YSL Black Opium Eau de Parfum 90ml.',
        price_coins: 69000,
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500'],
        stock: 25,
        weight_kg: 0.5,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 7 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Dior Sauvage Eau de Parfum Spray (100ml)',
        sku: 'PRD-PRF-34',
        category: catPerfumes._id,
        description: 'Radiant top notes burst with the juicy freshness of Reggio di Calabria Bergamont, followed by a powerful woody trail of Papua New Guinean Vanilla absolute.',
        short_description: 'Dior Sauvage Eau de Parfum Spray 100ml.',
        price_coins: 78750,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
        stock: 30,
        weight_kg: 0.6,
        dimensions: { length_cm: 15, width_cm: 10, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Chanel Coco Mademoiselle Eau de Parfum (100ml)',
        sku: 'PRD-PRF-35',
        category: catPerfumes._id,
        description: 'An amber fragrance with a strong personality and surprising freshness. Notes of vibrant orange immediately awaken the senses, with jasmine and rose heart.',
        short_description: 'Chanel Coco Mademoiselle EDP 100ml.',
        price_coins: 93750,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'],
        stock: 25,
        weight_kg: 0.6,
        dimensions: { length_cm: 15, width_cm: 10, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Tom Ford Tobacco Vanille Eau de Parfum (50ml)',
        sku: 'PRD-PRF-36',
        category: catPerfumes._id,
        description: 'Opulent, warm, and iconic private blend featuring opulent essence of tobacco leaf, spicy notes, tonka bean, and sweet vanilla.',
        short_description: 'Tom Ford Tobacco Vanille EDP 50ml.',
        price_coins: 123750,
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500'],
        stock: 15,
        weight_kg: 0.5,
        dimensions: { length_cm: 12, width_cm: 8, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Baccarat Rouge 540 Maison Francis Kurkdjian (70ml)',
        sku: 'PRD-PRF-37',
        category: catPerfumes._id,
        description: 'Poetic alchemy where breezy jasmine, radiant saffron, ambergris mineral notes, and freshly-cut cedar wood blend together.',
        short_description: 'MFK Baccarat Rouge 540 EDP 70ml.',
        price_coins: 198750,
        images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500'],
        stock: 15,
        weight_kg: 0.6,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Creed Aventus Eau de Parfum Fragrance Spray (100ml)',
        sku: 'PRD-PRF-38',
        category: catPerfumes._id,
        description: 'Sensual, audacious, and contemporary niche fragrance. Top notes of lemon, pink pepper, apple, and bergamot, leading to birch and patchouli.',
        short_description: 'Creed Aventus Eau de Parfum Spray 100ml.',
        price_coins: 258750,
        images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500'],
        stock: 12,
        weight_kg: 0.7,
        dimensions: { length_cm: 16, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // --- 6. BEAUTY & FASHION ---
      {
        name: 'Custom Printed Family T-Shirts (Pack of 4)',
        sku: 'PRD-US-FAS-39',
        category: catBeauty._id,
        description: '100% heavy combed cotton matching t-shirts printed with custom family crest or names.',
        short_description: 'Custom Printed Family T-Shirts (4 Pack).',
        price_coins: 21000,
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500'],
        stock: 50,
        weight_kg: 0.8,
        dimensions: { length_cm: 30, width_cm: 25, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Carhartt Heavyweight Pocket T-Shirt',
        sku: 'PRD-US-FAS-40',
        category: catBeauty._id,
        description: 'Durable 6.75 oz 100% cotton jersey knit with side-seam construction and left-chest pocket with logo patch.',
        short_description: 'Carhartt Heavyweight Pocket T-Shirt.',
        price_coins: 24750,
        images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500'],
        stock: 45,
        weight_kg: 0.4,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 4 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Sol de Janeiro Brazilian Bum Bum Body Cream (240ml)',
        sku: 'PRD-US-FAS-41',
        category: catBeauty._id,
        description: 'Award-winning body cream infused with Guaraná extract to visibly tighten and smooth skin. Cheirosa 62 pistachio salted caramel scent.',
        short_description: 'Sol de Janeiro Brazilian Bum Bum Cream.',
        price_coins: 29250,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
        stock: 50,
        weight_kg: 0.5,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Womens Elegant Leather High Heels Pumps',
        sku: 'PRD-US-FAS-42',
        category: catBeauty._id,
        description: 'Classic 3-inch stiletto heel pumps crafted with genuine nappa leather upper and cushioned memory foam footbed.',
        short_description: 'Womens Leather High Heels / Pumps.',
        price_coins: 36000,
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'],
        stock: 30,
        weight_kg: 0.9,
        dimensions: { length_cm: 28, width_cm: 18, height_cm: 11 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Italian Handcrafted Mens Leather Oxford Shoes',
        sku: 'PRD-US-FAS-43',
        category: catBeauty._id,
        description: 'Burnished full-grain Italian calfskin leather dress shoes with Goodyear welted leather sole.',
        short_description: 'Italian Mens Leather Oxford Dress Shoes.',
        price_coins: 48000,
        images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500'],
        stock: 25,
        weight_kg: 1.2,
        dimensions: { length_cm: 34, width_cm: 22, height_cm: 12 },
        package_type: 'box',
        fragile: false,
        featured: true
      },

      // --- 7. FOOD & GROCERIES ---
      {
        name: 'Kirkland Signature 100% Pure Organic Maple Syrup (33.8 fl oz)',
        sku: 'PRD-GRO-44',
        category: catFood._id,
        description: 'USDA Certified Organic Grade A Amber Rich Taste maple syrup harvested from Canadian maple trees.',
        short_description: 'Kirkland Organic 100% Pure Maple Syrup 1L.',
        price_coins: 13875,
        images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500'],
        stock: 45,
        weight_kg: 1.4,
        dimensions: { length_cm: 22, width_cm: 10, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Trader Joe\'s Organic Raw Wildflower Honey Bears (12 oz)',
        sku: 'PRD-GRO-45',
        category: catFood._id,
        description: 'Unpasteurized and unfiltered raw honey harvested from wildflowers.',
        short_description: 'Trader Joe\'s Organic Raw Honey Bear 12 oz.',
        price_coins: 15375,
        images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500'],
        stock: 50,
        weight_kg: 0.5,
        dimensions: { length_cm: 15, width_cm: 8, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Starbucks Whole Bean Dark Roast Coffee (32 oz Bag)',
        sku: 'PRD-GRO-46',
        category: catFood._id,
        description: '100% Arabica whole bean coffee with rich cocoa and toasted sweet spice notes. Packaged in flavor lock valve bag.',
        short_description: 'Starbucks Dark Roast Whole Bean Coffee 32 oz.',
        price_coins: 18375,
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'],
        stock: 50,
        weight_kg: 0.9,
        dimensions: { length_cm: 20, width_cm: 12, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },

      // --- 8. HOME & LIVING ---
      {
        name: 'Insulated Stainless Steel Water Bottle Set (40 oz)',
        sku: 'PRD-HOM-47',
        category: catHome._id,
        description: 'Double-wall vacuum insulated stainless steel water bottle with straw lid.',
        short_description: 'Insulated Stainless Steel Water Bottle Set.',
        price_coins: 12750,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
        stock: 60,
        weight_kg: 0.9,
        dimensions: { length_cm: 30, width_cm: 15, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Customized Printed Throw Pillow (Set of 2)',
        sku: 'PRD-HOM-48',
        category: catHome._id,
        description: 'Soft linen throw pillows printed with custom family photos or anniversary dates.',
        short_description: 'Customized Printed Throw Pillow Set.',
        price_coins: 14250,
        images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500'],
        stock: 50,
        weight_kg: 0.8,
        dimensions: { length_cm: 45, width_cm: 45, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Customized Family Photo Picture Frame (12x16")',
        sku: 'PRD-HOM-49',
        category: catHome._id,
        description: 'Solid wood portrait picture frame with white woman photo print hung elegantly on a living room wall with real glass cover.',
        short_description: 'Customized Family Photo Picture Frame.',
        price_coins: 15750,
        images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500'],
        stock: 40,
        weight_kg: 1.2,
        dimensions: { length_cm: 40, width_cm: 30, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Luxury Scented Soy Candles Box (Set of 3)',
        sku: 'PRD-HOM-50',
        category: catHome._id,
        description: 'Hand-poured 100% natural soy wax candles with lavender, vanilla, and eucalyptus essential oil scents.',
        short_description: 'Luxury Scented Soy Candles Box (3 Set).',
        price_coins: 16875,
        images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500'],
        stock: 45,
        weight_kg: 1.1,
        dimensions: { length_cm: 25, width_cm: 10, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: false
      },

      // --- 9. AUTOMOTIVE & VEHICLES ---
      {
        name: 'AstroAI Digital Car Tire Pressure Gauge & Inflator',
        sku: 'PRD-US-AUT-51',
        category: catAuto._id,
        description: 'Heavy duty digital tire inflator gauge with 250 PSI resolution LCD display and quick connect coupler.',
        short_description: 'AstroAI Digital Tire Pressure Gauge.',
        price_coins: 11625,
        images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=500'],
        stock: 50,
        weight_kg: 0.5,
        dimensions: { length_cm: 18, width_cm: 10, height_cm: 5 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Armor All Ultimate 8-Piece Car Wash Bucket Kit',
        sku: 'PRD-US-AUT-52',
        category: catAuto._id,
        description: 'Includes Ultra Shinning Car Wash & Wax, Tire Foam Protectant, Glass Wipes, Microfiber Towel, and Wash Mitt.',
        short_description: 'Armor All 8-Piece Car Wash Kit.',
        price_coins: 22500,
        images: ['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500'],
        stock: 40,
        weight_kg: 3.5,
        dimensions: { length_cm: 30, width_cm: 25, height_cm: 25 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Car Jump Starter',
        sku: 'PRD-US-AUT-53',
        category: catAuto._id,
        description: 'Safely jump start a dead battery in seconds. Rated for gasoline engines up to 6 liters and diesel engines up to 3 liters.',
        short_description: 'NOCO GB40 1000A Lithium Car Jump Starter.',
        price_coins: 61500,
        images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=500'],
        stock: 30,
        weight_kg: 1.2,
        dimensions: { length_cm: 20, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Garmin Dash Cam 57 1440p Quad HD Driving Recorder',
        sku: 'PRD-US-AUT-54',
        category: catAuto._id,
        description: 'Wide 140-degree field of view captures clear 1440p HD video. Voice control, incident detection, and live view monitoring.',
        short_description: 'Garmin Dash Cam 57 Quad HD Driving Camera.',
        price_coins: 111000,
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=500'],
        stock: 22,
        weight_kg: 0.5,
        dimensions: { length_cm: 12, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'BYD EV Portable Home Charger 11kW Wallbox & Cable',
        sku: 'PRD-US-AUT-55',
        category: catAuto._id,
        description: 'Universal EV charging cable nozzle and wallbox unit compatible with BYD Seal, Atto 3, Dolphin, and all Type 2 electric vehicles.',
        short_description: 'Fast 11kW EV Portable Home Charger Cable & Wallbox.',
        price_coins: 127500,
        images: ['https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=500'],
        stock: 25,
        weight_kg: 5.0,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 15 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Tesla Universal Mobile Connector EV Charger Cable Bundle',
        sku: 'PRD-US-AUT-56',
        category: catAuto._id,
        description: 'Official Tesla portable charging cable plug handle with NEMA 5-15 standard outlet adapter and NEMA 14-50 fast 240V charging adapter.',
        short_description: 'Tesla Universal Mobile EV Charger Cable & Plug Bundle.',
        price_coins: 172500,
        images: ['https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=500'],
        stock: 20,
        weight_kg: 4.2,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 12 },
        package_type: 'box',
        fragile: true,
        featured: true
      }
    ]);

    console.log('Real-life US marketplace products seeded successfully.');

    // 5. Create Delivery Pricing Rules
    await DeliveryPricingRule.create([
      { country: 'United Kingdom', state: 'ALL', weight_min: 0, weight_max: 5, base_price: 19000, per_kg_price: 1500, express_fee: 5000, fragile_fee: 2500, handling_fee: 1000 },
      { country: 'United Kingdom', state: 'ALL', weight_min: 5, weight_max: 20, base_price: 26000, per_kg_price: 1200, express_fee: 6000, fragile_fee: 3000, handling_fee: 1500 },
      { country: 'United States', state: 'ALL', weight_min: 0, weight_max: 5, base_price: 25000, per_kg_price: 2000, express_fee: 7000, fragile_fee: 3000, handling_fee: 1500 },
      { country: 'United States', state: 'ALL', weight_min: 5, weight_max: 20, base_price: 35000, per_kg_price: 1800, express_fee: 9000, fragile_fee: 4000, handling_fee: 2000 },
      { country: 'Canada', state: 'ALL', weight_min: 0, weight_max: 20, base_price: 27000, per_kg_price: 2200, express_fee: 8000, fragile_fee: 3500, handling_fee: 2000 },
      { country: 'ALL', state: 'ALL', weight_min: 0, weight_max: 9999, base_price: 30000, per_kg_price: 2500, express_fee: 10000, fragile_fee: 5000, handling_fee: 2500 }
    ]);

    console.log('Delivery pricing rules configured.');

    // 6. Create Ad Platforms
    const platWhatsApp = await AdPlatform.create({
      name: 'WhatsApp Ads',
      slug: 'whatsapp-ads',
      prohibited_categories: [],
      restricted_categories: [],
      min_age: 13,
      creative_requirements: { max_size_mb: 200, formats: ['jpg', 'png', 'mp4'], formats_display: 'JPG, PNG, MP4 (Max 200MB)' },
      landing_page_required: false
    });

    const platZangi = await AdPlatform.create({
      name: 'Zangi Ads',
      slug: 'zangi-ads',
      prohibited_categories: [],
      restricted_categories: [],
      min_age: 13,
      creative_requirements: { max_size_mb: 200, formats: ['jpg', 'png', 'mp4'], formats_display: 'JPG, PNG, MP4 (Max 200MB)' },
      landing_page_required: false
    });

    const platTikTok = await AdPlatform.create({
      name: 'TikTok Ads',
      slug: 'tiktok-ads',
      prohibited_categories: [],
      restricted_categories: [],
      min_age: 13,
      creative_requirements: { max_size_mb: 200, formats: ['mp4', 'mov'], formats_display: 'MP4, MOV (Max 200MB)' },
      landing_page_required: false
    });

    const platFacebook = await AdPlatform.create({
      name: 'Facebook Ads',
      slug: 'facebook-ads',
      prohibited_categories: [],
      restricted_categories: [],
      min_age: 13,
      creative_requirements: { max_size_mb: 200, formats: ['jpg', 'png', 'mp4'], formats_display: 'JPG, PNG, MP4 (Max 200MB)' },
      landing_page_required: false
    });

    const platSnapchat = await AdPlatform.create({
      name: 'Snapchat Ads',
      slug: 'snapchat-ads',
      prohibited_categories: [],
      restricted_categories: [],
      min_age: 13,
      creative_requirements: { max_size_mb: 200, formats: ['mp4', 'png'], formats_display: 'MP4, PNG (Max 200MB)' },
      landing_page_required: false
    });

    const platAllSocial = await AdPlatform.create({
      name: 'All Social Media Platforms',
      slug: 'all-social-media',
      prohibited_categories: [],
      restricted_categories: [],
      min_age: 13,
      creative_requirements: { max_size_mb: 200, formats: ['jpg', 'png', 'mp4'], formats_display: 'JPG, PNG, MP4 (Max 200MB)' },
      landing_page_required: false
    });

    console.log('Ad platforms configured.');

    // 7. Create Ad Pricing Rules
    const goals = [
      'Hookup Ads', 'Dating Ads', 'Drug Ads', 'Celeb Ads', 'BYD Update Ads', 'Pet Update Ads',
      'Investment Ads', 'Sport Ads', 'Apartment Ads', 'Real Estate Ads', 'Furniture Ads',
      'Vehicle Ads', 'Electronics Ads', 'Phone Ads', 'Job Ads', 'Baby Sitting Ads',
      'Nanny Ads', 'Crypto Ads', 'Gift Cards Ads', 'Forex & Trading Ads', 'Fashion & Beauty Ads',
      'Gaming & Esports Ads', 'General Commercial Ads'
    ];
    const platforms = [platWhatsApp, platZangi, platTikTok, platFacebook, platSnapchat, platAllSocial];

    for (const plat of platforms) {
      for (const goal of goals) {
        await AdPricingRule.create({
          platform: plat._id,
          objective: goal,
base_management_fee_coins: 0,
          creative_fee_coins: 5000,
          platform_spend_min_coins: 7000
        });
      }
    }

    // 8. Seed Sample Active Classified Ads Marketplace Items across Countries
    await AdCampaign.create([
      {
        campaign_number: 'AD-MKT-001',
        user: adminUser._id,
        name: 'VIP Hookups & Connect Services',
        business_name: 'VIP Connections Network',
        product_service: 'Adult Social & Hookups',
        landing_page: 'https://zangi.com/vip-hookups',
        contact_info: '+1 (555) 234-5678',
        objective: 'Hookup Ads',
        category: 'Hookup Ads',
        platform: platWhatsApp._id,
        duration_hours: 72,
        creative: {
          headline: 'Instant Hookups & Verified Matches',
          copy: 'Connect directly with active verified profiles in London, New York & Toronto. Discreet 24/7 service.',
          destination_url: 'https://zangi.com/vip-hookups'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
          original_name: 'vip_hookup.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', city: 'New York' }],
        impressions_views: 45200,
        clicks: 3410,
        status: 'ACTIVE',
        total_cost_coins: 21000,
        platform_budget_coins: 21000,
        management_fee_coins: 0,
        compliance_declared: true,
        posting_url: 'https://whatsapp.com/channel/vip-hookups'
      },
      {
        campaign_number: 'AD-MKT-002',
        user: adminUser._id,
        name: 'Luxury 4-Bedroom Villa Sale',
        business_name: 'Prime Estate Holdings',
        product_service: 'Real Estate & Properties',
        landing_page: 'https://primeestate.com/lekki-villa',
        contact_info: 'sales@primeestate.com',
        objective: 'Real Estate Ads',
        category: 'Real Estate Ads',
        platform: platFacebook._id,
        duration_hours: 168,
        creative: {
          headline: 'Luxury Smart Villa in Lekki Phase 1',
          copy: 'Spacious 4-bedroom detached villa with swimming pool, solar power, and 24/7 security. Immediate C of O available.',
          destination_url: 'https://primeestate.com/lekki-villa'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
          original_name: 'luxury_villa.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'Nigeria', city: 'Lagos' }],
        impressions_views: 89100,
        clicks: 6720,
        status: 'ACTIVE',
        total_cost_coins: 49000,
        platform_budget_coins: 49000,
        management_fee_coins: 0,
        compliance_declared: true,
        posting_url: 'https://facebook.com/primeestate/posts/101'
      },
      {
        campaign_number: 'AD-MKT-003',
        user: adminUser._id,
        name: 'BYD Seal 2026 Electric Sedan Flash Deal',
        business_name: 'EV World Auto Berlin',
        product_service: 'BYD Automotive & Electric Cars',
        landing_page: 'https://evworld.de/byd-seal',
        contact_info: 'info@evworld.de',
        objective: 'BYD Update Ads',
        category: 'BYD Update Ads',
        platform: platTikTok._id,
        duration_hours: 120,
        creative: {
          headline: 'BYD Seal 2026 Edition Available in Berlin',
          copy: '0-100 km/h in 3.8s, 570km range EV sedan. Test drive available in Berlin & Munich with instant delivery.',
          destination_url: 'https://evworld.de/byd-seal'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600',
          original_name: 'byd_electric_car.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'Germany', city: 'Berlin' }],
        impressions_views: 38400,
        clicks: 2950,
        status: 'ACTIVE',
        total_cost_coins: 35000,
        platform_budget_coins: 35000,
        management_fee_coins: 0,
        compliance_declared: true,
        posting_url: 'https://tiktok.com/@evworld/video/202'
      },
      {
        campaign_number: 'AD-MKT-004',
        user: adminUser._id,
        name: 'Instant Gift Card Trading & Exchange',
        business_name: 'CardTrader Global',
        product_service: 'Gift Cards & Digital Vouchers',
        landing_page: 'https://cardtrader.com',
        contact_info: '+44 7700 900123',
        objective: 'Gift Cards Ads',
        category: 'Gift Cards Ads',
        platform: platSnapchat._id,
        duration_hours: 96,
        creative: {
          headline: 'Sell Steam, Apple & Amazon Gift Cards Fast',
          copy: 'Get paid instantly in minutes. Highest market rates for UK & US gift card codes.',
          destination_url: 'https://cardtrader.com'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
          original_name: 'gift_cards.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United Kingdom', city: 'London' }],
        impressions_views: 62000,
        clicks: 4890,
        status: 'ACTIVE',
        total_cost_coins: 28000,
        platform_budget_coins: 28000,
        management_fee_coins: 0,
        compliance_declared: true,
        posting_url: 'https://snapchat.com/add/cardtrader'
      },
      {
        campaign_number: 'AD-MKT-005',
        user: adminUser._id,
        name: 'Web3 Crypto Signal & NFT Community',
        business_name: 'Alpha Crypto Signals',
        product_service: 'Crypto & Forex Trading',
        landing_page: 'https://t.me/alphacryptosignals',
        contact_info: 'contact@alphacrypto.io',
        objective: 'Crypto Ads',
        category: 'Crypto Ads',
        platform: platAllSocial._id,
        duration_hours: 144,
        creative: {
          headline: 'Daily 85%+ Accuracy Crypto Trading Signals',
          copy: 'Join 40,000+ traders making daily profits in Bitcoin, Ethereum & Altcoins.',
          destination_url: 'https://t.me/alphacryptosignals'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600',
          original_name: 'crypto_trading.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'Canada', city: 'Toronto' }],
        impressions_views: 51200,
        clicks: 4100,
        status: 'ACTIVE',
        total_cost_coins: 42000,
        platform_budget_coins: 42000,
        management_fee_coins: 0,
        compliance_declared: true,
        posting_url: 'https://t.me/alphacryptosignals'
      }
    ]);

    console.log('Marketplace active sample campaigns seeded across countries.');
    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedData();
