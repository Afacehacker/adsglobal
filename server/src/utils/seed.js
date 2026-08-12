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
    let connStr = (process.env.MONGODB_URI || '').trim().replace(/^["']|["']$/g, '');
    
    if (!connStr || (!connStr.startsWith('mongodb://') && !connStr.startsWith('mongodb+srv://'))) {
      connStr = 'mongodb://127.0.0.1:27017/adsglobal';
    }
    
    await mongoose.connect(connStr);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data for a clean fresh catalog reload
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
      password: 'admin123',
      role: 'SUPER_ADMIN',
      emailVerified: true
    });
    await Wallet.create({ user: adminUser._id, balance: 1000000 });

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
    const catHome = await ProductCategory.create({ name: 'Home & Living', slug: 'home-living', description: 'Home decor, frames, throw pillows, and candles' });
    const catAuto = await ProductCategory.create({ name: 'Automotive & Vehicles', slug: 'automotive-vehicles', description: 'Vehicle parts, EV chargers, and car accessories' });

    console.log('Product categories created.');

    // 4. Seed 100+ Real-Life US Marketplace Products Across Categories
    await Product.create([
      // --- 1. FAST FOOD & EXPRESS MEALS (Cheap ones first) ---
      {
        name: 'Coca-Cola Original Taste Soda Cans (12-Can Pack)',
        sku: 'PRD-FF-01',
        category: catFastFood._id,
        description: 'Original Coca-Cola taste in a convenient 12-can fridge pack. Refreshing carbonated soft drink.',
        short_description: 'Coca-Cola Classic 12-can fridge pack.',
        price_coins: 11250,
        images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500'],
        stock: 120,
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
        stock: 100,
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
        stock: 80,
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
        stock: 90,
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
        stock: 65,
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
        stock: 85,
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
        stock: 55,
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
        stock: 75,
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
        stock: 70,
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
        stock: 45,
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
        images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500'],
        stock: 50,
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
        price_coins: 25500,
        images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
        stock: 65,
        weight_kg: 0.8,
        dimensions: { length_cm: 28, width_cm: 20, height_cm: 5 },
        package_type: 'box',
        fragile: false,
        featured: true
      },

      // --- 3. ELECTRONICS & TECH ---
      {
        name: 'Logitech MX Master 3S Wireless Performance Mouse',
        sku: 'PRD-US-TEC-17',
        category: catTech._id,
        description: '8K DPI any-surface tracking, quiet clicks, MagSpeed electromagnetic scrolling, USB-C fast charging.',
        short_description: 'Logitech MX Master 3S Wireless Mouse.',
        price_coins: 22500,
        images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'],
        stock: 60,
        weight_kg: 0.4,
        dimensions: { length_cm: 15, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Bose SoundLink Flex Bluetooth Portable Speaker',
        sku: 'PRD-US-TEC-18',
        category: catTech._id,
        description: 'IP67 waterproof and dustproof wireless speaker with PositionIQ technology and 12 hours battery life.',
        short_description: 'Bose SoundLink Flex Waterproof Bluetooth Speaker.',
        price_coins: 33750,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
        stock: 55,
        weight_kg: 0.6,
        dimensions: { length_cm: 20, width_cm: 9, height_cm: 5 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Apple AirPods Pro (2nd Generation) MagSafe Case (USB-C)',
        sku: 'PRD-US-TEC-23',
        category: catTech._id,
        description: 'Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, H2 chip, up to 30 hours battery life.',
        short_description: 'Apple AirPods Pro 2 USB-C Noise Cancelling Earbuds.',
        price_coins: 56250,
        images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500'],
        stock: 50,
        weight_kg: 0.3,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Nintendo Switch OLED Model with White Joy-Con',
        sku: 'PRD-US-TEC-24',
        category: catTech._id,
        description: ' Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port dock, 64 GB internal storage.',
        short_description: 'Nintendo Switch OLED Console (White).',
        price_coins: 78750,
        images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500'],
        stock: 35,
        weight_kg: 1.5,
        dimensions: { length_cm: 26, width_cm: 21, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        sku: 'PRD-US-TEC-25',
        category: catTech._id,
        description: 'Industry-leading noise canceling with 8 microphones and Auto NC Optimizer, 30-hour battery life with quick charging.',
        short_description: 'Sony WH-1000XM5 Noise Canceling Headphones.',
        price_coins: 90000,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        stock: 40,
        weight_kg: 0.8,
        dimensions: { length_cm: 24, width_cm: 22, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Sony PlayStation 5 Slim Console Disc Edition',
        sku: 'PRD-US-TEC-25B',
        category: catTech._id,
        description: '1TB Custom SSD ultra-high speed, DualSense Wireless Controller with haptic feedback, 4K 120Hz gaming support.',
        short_description: 'Sony PlayStation 5 Slim 1TB Disc Console.',
        price_coins: 135000,
        images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500'],
        stock: 30,
        weight_kg: 4.8,
        dimensions: { length_cm: 40, width_cm: 35, height_cm: 18 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Apple iPhone 15 Pro Max (256GB Natural Titanium)',
        sku: 'PRD-US-TEC-25C',
        category: catTech._id,
        description: 'Forged in titanium, A17 Pro chip, 48MP main camera with 5x telephoto lens, USB-C 3 speed connector. Unlocked.',
        short_description: 'Apple iPhone 15 Pro Max 256GB Unlocked.',
        price_coins: 295000,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
        stock: 25,
        weight_kg: 0.5,
        dimensions: { length_cm: 18, width_cm: 10, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // --- 4. JEWELRY & FINE ACCESSORIES ---
      {
        name: 'Sterling Silver Matching Couple Promise Rings Set',
        sku: 'PRD-JWL-26',
        category: catJewelry._id,
        description: '925 sterling silver adjustable couple promise rings engraved with "Her King" and "His Queen".',
        short_description: 'Sterling Silver Couple Promise Rings Set.',
        price_coins: 13500,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'],
        stock: 80,
        weight_kg: 0.2,
        dimensions: { length_cm: 8, width_cm: 8, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: '18K Yellow Gold Plated Heart Pendant Necklace',
        sku: 'PRD-JWL-27',
        category: catJewelry._id,
        description: 'Dainty 18K yellow gold plated brass cubic zirconia heart pendant necklace with 18-inch chain.',
        short_description: '18K Gold Plated Heart Pendant Necklace.',
        price_coins: 16875,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        stock: 75,
        weight_kg: 0.2,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: '14K Solid Gold Diamond Solitaire Engagement Ring (1 Carat)',
        sku: 'PRD-JWL-30',
        category: catJewelry._id,
        description: '1.00 Carat round brilliant cut lab-grown diamond set in 14K solid white gold 4-prong solitaire band.',
        short_description: '14K Solid Gold 1 Carat Diamond Ring.',
        price_coins: 112500,
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'],
        stock: 20,
        weight_kg: 0.2,
        dimensions: { length_cm: 8, width_cm: 8, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Rolex Submariner Date 41mm Stainless Steel Watch',
        sku: 'PRD-JWL-30B',
        category: catJewelry._id,
        description: 'Oystersteel case with black Cerachrom bezel insert, black dial, large luminescent hour markers, Oyster bracelet.',
        short_description: 'Rolex Submariner Date 41mm Luxury Watch.',
        price_coins: 450000,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        stock: 10,
        weight_kg: 0.9,
        dimensions: { length_cm: 15, width_cm: 15, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // --- 5. PERFUMES & LUXURY FRAGRANCES ---
      {
        name: 'Victoria\'s Secret Velvet Petals Body Mist & Lotion Set',
        sku: 'PRD-PRF-31',
        category: catPerfumes._id,
        description: 'Lush bloom and almond glaze fragrance mist (250ml) paired with matching velvet body lotion (236ml).',
        short_description: 'Victoria\'s Secret Velvet Petals Set.',
        price_coins: 13125,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
        stock: 90,
        weight_kg: 0.7,
        dimensions: { length_cm: 20, width_cm: 15, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Giorgio Armani Acqua Di Giò Eau de Toilette (100ml)',
        sku: 'PRD-PRF-32',
        category: catPerfumes._id,
        description: 'Iconic marine aquatic fragrance with bergamot, neroli, green tangerine, rosemary, and patchouli.',
        short_description: 'Giorgio Armani Acqua Di Giò EDT 100ml.',
        price_coins: 29250,
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'],
        stock: 60,
        weight_kg: 0.5,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Dior Sauvage Eau de Parfum Spray (100ml)',
        sku: 'PRD-PRF-34',
        category: catPerfumes._id,
        description: 'Calabrian bergamot, Sichuan pepper, and Papua New Guinean vanilla absolute. Powerful and noble scent trail.',
        short_description: 'Dior Sauvage Eau de Parfum Spray 100ml.',
        price_coins: 39000,
        images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500'],
        stock: 55,
        weight_kg: 0.5,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Maison Francis Kurkdjian Baccarat Rouge 540 EDP (70ml)',
        sku: 'PRD-PRF-37',
        category: catPerfumes._id,
        description: 'Luminous and intense amber floral fragrance with jasmine, saffron, cedarwood, and ambergris notes.',
        short_description: 'Baccarat Rouge 540 Eau de Parfum 70ml.',
        price_coins: 97500,
        images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500'],
        stock: 30,
        weight_kg: 0.6,
        dimensions: { length_cm: 15, width_cm: 10, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Creed Aventus Eau de Parfum Spray (100ml)',
        sku: 'PRD-PRF-38',
        category: catPerfumes._id,
        description: 'Sensual, audacious, and contemporary scent combining apple, blackcurrant, pineapple, birch, and oakmoss.',
        short_description: 'Creed Aventus Eau de Parfum 100ml.',
        price_coins: 123750,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
        stock: 25,
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
        stock: 80,
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
        stock: 75,
        weight_kg: 0.4,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 4 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Italian Handcrafted Mens Leather Oxford Shoes',
        sku: 'PRD-US-FAS-43',
        category: catBeauty._id,
        description: 'Burnished full-grain Italian calfskin leather dress shoes with Goodyear welted leather sole.',
        short_description: 'Italian Mens Leather Oxford Dress Shoes.',
        price_coins: 48000,
        images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500'],
        stock: 45,
        weight_kg: 1.2,
        dimensions: { length_cm: 34, width_cm: 22, height_cm: 12 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Ray-Ban Classic Polarized Wayfarer Sunglasses',
        sku: 'PRD-US-FAS-43E',
        category: catBeauty._id,
        description: 'Iconic G-15 green polarized lenses with classic black acetate frame. 100% UV protection with case.',
        short_description: 'Ray-Ban Classic Polarized Wayfarer Sunglasses.',
        price_coins: 112500,
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
        stock: 50,
        weight_kg: 0.3,
        dimensions: { length_cm: 18, width_cm: 8, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Nike Air Jordan 1 Retro High OG Chicago Sneakers',
        sku: 'PRD-US-FAS-43F',
        category: catBeauty._id,
        description: 'Iconic red, white, and black basketball sneaker featuring premium leather uppers, Air-Sole cushioning, and Wings logo.',
        short_description: 'Nike Air Jordan 1 Retro High OG Sneakers.',
        price_coins: 131250,
        images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500'],
        stock: 35,
        weight_kg: 1.4,
        dimensions: { length_cm: 34, width_cm: 24, height_cm: 14 },
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
        stock: 80,
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
        stock: 90,
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
        stock: 85,
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
        stock: 90,
        weight_kg: 0.9,
        dimensions: { length_cm: 30, width_cm: 15, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Customized Family Photo Picture Frame (12x16")',
        sku: 'PRD-HOM-49',
        category: catHome._id,
        description: 'Solid wood portrait picture frame with white woman photo print hung elegantly on a living room wall with real glass cover.',
        short_description: 'Customized Family Photo Picture Frame.',
        price_coins: 15750,
        images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500'],
        stock: 70,
        weight_kg: 1.2,
        dimensions: { length_cm: 40, width_cm: 30, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },


      // --- ADDITIONAL REAL-LIFE US MARKETPLACE PRODUCTS (TOTAL 100+ ITEMS) ---
      {
        name: 'Five Guys Bacon Cheeseburger & Cajun Fries Combo Meal',
        sku: 'PRD-FF-09',
        category: catFastFood._id,
        description: 'Two handcrafted patties grilled to order with crispy applewood smoked bacon and American cheese on a toasted sesame seed bun with spicy Cajun fries.',
        short_description: 'Five Guys Bacon Cheeseburger & Cajun Fries meal.',
        price_coins: 17250,
        images: ['https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500'],
        stock: 100,
        weight_kg: 1.3,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 12 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Chipotle Chicken Burrito Bowl with Fresh Guacamole',
        sku: 'PRD-FF-10',
        category: catFastFood._id,
        description: 'Adobo-marinated grilled chicken over cilantro-lime brown rice, black beans, fresh tomato salsa, Monterey Jack cheese, and handmade guacamole.',
        short_description: 'Chipotle Chicken Burrito Bowl with Guacamole.',
        price_coins: 18000,
        images: ['https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500'],
        stock: 90,
        weight_kg: 1.1,
        dimensions: { length_cm: 22, width_cm: 22, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Dunkin\' Assorted Glazed & Frosted Donuts Box (12 Pack)',
        sku: 'PRD-FF-11',
        category: catFastFood._id,
        description: 'One dozen fresh donuts including chocolate frosted, Boston Kreme, powdered jelly, and old fashioned glazed.',
        short_description: 'Dunkin\' Assorted Donuts Box (12 Pack).',
        price_coins: 18750,
        images: ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500'],
        stock: 80,
        weight_kg: 1.2,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Domino\'s Ultimate Meat Lovers Hand-Tossed Pizza (14")',
        sku: 'PRD-FF-12',
        category: catFastFood._id,
        description: 'Topped with pepperoni, Italian sausage, ham, savory beef, and smoked bacon on a garlic-seasoned crust.',
        short_description: 'Domino\'s Ultimate Meat Lovers 14" Pizza.',
        price_coins: 19500,
        images: ['https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500'],
        stock: 75,
        weight_kg: 1.7,
        dimensions: { length_cm: 36, width_cm: 36, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Tea Forté Organic Herbal Tea Tasting Chest (40 Pyramids)',
        sku: 'PRD-GIF-13',
        category: catGifts._id,
        description: 'Luxury presentation box with 40 handcrafted silk pyramid tea infusers featuring 20 organic herbal & black tea blends.',
        short_description: 'Tea Forté Organic Tea Tasting Chest (40 Pyramids).',
        price_coins: 28500,
        images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500'],
        stock: 60,
        weight_kg: 1.2,
        dimensions: { length_cm: 30, width_cm: 22, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Harry & David Royal Riviera Pears Luxury Gift Box',
        sku: 'PRD-GIF-14',
        category: catGifts._id,
        description: 'Nine famous sweet, juicy Royal Riviera Pears grown in Oregon orchards, hand-picked and gold foil wrapped.',
        short_description: 'Harry & David Royal Riviera Pears Gift Box.',
        price_coins: 31500,
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500'],
        stock: 50,
        weight_kg: 2.8,
        dimensions: { length_cm: 32, width_cm: 25, height_cm: 12 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Fresh Premium Red Roses & White Lilies Floral Bouquet',
        sku: 'PRD-GIF-15',
        category: catGifts._id,
        description: '12 long-stemmed Ecuadorian red roses paired with oriental white lilies and eucalyptus greens in a glass vase.',
        short_description: 'Red Roses & White Lilies Fresh Bouquet.',
        price_coins: 34500,
        images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500'],
        stock: 45,
        weight_kg: 2.0,
        dimensions: { length_cm: 45, width_cm: 25, height_cm: 20 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Hickory Farms Beef Sausage & Smoked Cheese Gift Basket',
        sku: 'PRD-GIF-16',
        category: catGifts._id,
        description: 'Signature beef summer sausages, smoked gouda, farm cheddar, sweet hot mustard, and toasted crackers.',
        short_description: 'Hickory Farms Beef & Cheese Gift Basket.',
        price_coins: 37500,
        images: ['https://images.unsplash.com/photo-1584278860047-22db9f3788b6?w=500'],
        stock: 55,
        weight_kg: 3.0,
        dimensions: { length_cm: 35, width_cm: 28, height_cm: 14 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Anker MagGo Magnetic Wireless Power Bank (10,000mAh)',
        sku: 'PRD-US-TEC-19',
        category: catTech._id,
        description: '15W Qi2 certified fast wireless charging battery pack with built-in kickstand and smart LED display.',
        short_description: 'Anker MagGo 10000mAh MagSafe Power Bank.',
        price_coins: 37500,
        images: ['https://images.unsplash.com/photo-1609592424009-5407fa6d03d7?w=500'],
        stock: 70,
        weight_kg: 0.4,
        dimensions: { length_cm: 12, width_cm: 8, height_cm: 3 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Amazon Kindle Paperwhite 16GB (6.8" Paperwhite Display)',
        sku: 'PRD-US-TEC-20',
        category: catTech._id,
        description: 'Flush-front design, 300 ppi glare-free display, adjustable warm light, waterproof (IPX8), up to 10 weeks battery.',
        short_description: 'Amazon Kindle Paperwhite 16GB e-Reader.',
        price_coins: 41250,
        images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500'],
        stock: 65,
        weight_kg: 0.3,
        dimensions: { length_cm: 18, width_cm: 13, height_cm: 2 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Ring Video Doorbell Pro 2 (1536p HD Head-to-Toe Video)',
        sku: 'PRD-US-TEC-21',
        category: catTech._id,
        description: 'Hardwired video doorbell with 3D Motion Detection, Bird\'s Eye View, Two-Way Talk, and night vision.',
        short_description: 'Ring Video Doorbell Pro 2 HD Security Camera.',
        price_coins: 45000,
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=500'],
        stock: 50,
        weight_kg: 0.5,
        dimensions: { length_cm: 15, width_cm: 8, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Google Nest Learning Thermostat 3rd Generation (Stainless)',
        sku: 'PRD-US-TEC-22',
        category: catTech._id,
        description: 'Auto-schedules based on your routine, remote app control, HVAC monitoring, energy history tracking.',
        short_description: 'Google Nest Smart Learning Thermostat.',
        price_coins: 48750,
        images: ['https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500'],
        stock: 45,
        weight_kg: 0.6,
        dimensions: { length_cm: 12, width_cm: 12, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Microsoft Xbox Series X 1TB Console (Black)',
        sku: 'PRD-US-TEC-25D',
        category: catTech._id,
        description: '12 Teraflops processing power, 4K gaming at up to 120 FPS, 3D Spatial Audio, Xbox Velocity Architecture.',
        short_description: 'Microsoft Xbox Series X 1TB Gaming Console.',
        price_coins: 142500,
        images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500'],
        stock: 30,
        weight_kg: 4.5,
        dimensions: { length_cm: 30, width_cm: 15, height_cm: 15 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Apple iPad Air 11-inch M2 Wi-Fi 128GB (Space Gray)',
        sku: 'PRD-US-TEC-25E',
        category: catTech._id,
        description: 'Liquid Retina display, M2 chip performance, landscape 12MP front camera, Wi-Fi 6E, USB-C.',
        short_description: 'Apple iPad Air 11" M2 Wi-Fi 128GB.',
        price_coins: 179000,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
        stock: 35,
        weight_kg: 0.6,
        dimensions: { length_cm: 25, width_cm: 18, height_cm: 3 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case',
        sku: 'PRD-US-TEC-25F',
        category: catTech._id,
        description: 'Robust titanium case, S9 SiP chip, 3000 nits display brightness, precision dual-frequency GPS, 36-hour battery.',
        short_description: 'Apple Watch Ultra 2 49mm Titanium.',
        price_coins: 225000,
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'],
        stock: 25,
        weight_kg: 0.5,
        dimensions: { length_cm: 12, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Samsung Galaxy S24 Ultra 512GB Unlocked AI Smartphone',
        sku: 'PRD-US-TEC-25G',
        category: catTech._id,
        description: 'Snapdragon 8 Gen 3 for Galaxy, Galaxy AI Live Translate, 200MP quad camera, S Pen included, Titanium frame.',
        short_description: 'Samsung Galaxy S24 Ultra 512GB Unlocked.',
        price_coins: 285000,
        images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
        stock: 20,
        weight_kg: 0.5,
        dimensions: { length_cm: 18, width_cm: 10, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Apple MacBook Pro 16" M3 Max 36GB RAM 1TB SSD',
        sku: 'PRD-US-TEC-25H',
        category: catTech._id,
        description: '16-core CPU, 40-core GPU, Liquid Retina XDR display, up to 22 hours battery, Space Black aluminum unibody.',
        short_description: 'Apple MacBook Pro 16" M3 Max Space Black.',
        price_coins: 750000,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
        stock: 12,
        weight_kg: 2.2,
        dimensions: { length_cm: 36, width_cm: 25, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Pandora Moments Sterling Silver Barrel Clasp Charm Bracelet',
        sku: 'PRD-JWL-28',
        category: catJewelry._id,
        description: 'Hand-finished sterling silver snake chain bracelet with signature barrel clasp and 2 decorative charms.',
        short_description: 'Pandora Sterling Silver Charm Bracelet.',
        price_coins: 22500,
        images: ['https://images.unsplash.com/photo-1611591475777-233ca73222d3?w=500'],
        stock: 60,
        weight_kg: 0.2,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: '14K White Gold Round Diamond Stud Earrings (0.5 Carat)',
        sku: 'PRD-JWL-29',
        category: catJewelry._id,
        description: 'Pair of classic 14K white gold 4-prong stud earrings with 0.50 ct total weight round brilliant cut diamonds.',
        short_description: '14K Gold 0.5 Carat Diamond Stud Earrings.',
        price_coins: 37500,
        images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500'],
        stock: 45,
        weight_kg: 0.1,
        dimensions: { length_cm: 8, width_cm: 8, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Cartier Love Bracelet 18K Yellow Gold',
        sku: 'PRD-JWL-30C',
        category: catJewelry._id,
        description: 'Iconic 18K yellow gold oval bangle composed of two rigid arcs bound together with a screwdriver.',
        short_description: 'Cartier Love Bracelet 18K Yellow Gold.',
        price_coins: 320000,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'],
        stock: 15,
        weight_kg: 0.3,
        dimensions: { length_cm: 12, width_cm: 12, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Yves Saint Laurent Black Opium Eau de Parfum (90ml)',
        sku: 'PRD-PRF-33',
        category: catPerfumes._id,
        description: 'Seductively intoxicating warm and spicy fragrance featuring coffee, vanilla, and white flowers.',
        short_description: 'YSL Black Opium Eau de Parfum 90ml.',
        price_coins: 33750,
        images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500'],
        stock: 70,
        weight_kg: 0.5,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Chanel Coco Mademoiselle Intense Eau de Parfum (100ml)',
        sku: 'PRD-PRF-35',
        category: catPerfumes._id,
        description: 'Oriental woody and amber fragrance with an extreme character, centered around patchouli and tonka bean.',
        short_description: 'Chanel Coco Mademoiselle Intense 100ml.',
        price_coins: 45000,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'],
        stock: 50,
        weight_kg: 0.5,
        dimensions: { length_cm: 15, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Tom Ford Tobacco Vanille Eau de Parfum Spray (50ml)',
        sku: 'PRD-PRF-36',
        category: catPerfumes._id,
        description: 'Opulent, warm, and iconic fragrance featuring tobacco leaf, spices, vanilla, cocoa, and sweet wood sap.',
        short_description: 'Tom Ford Tobacco Vanille EDP 50ml.',
        price_coins: 78000,
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500'],
        stock: 40,
        weight_kg: 0.4,
        dimensions: { length_cm: 12, width_cm: 8, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Luxury Leather Handbag & Matching Zip Clutch Bag Set',
        sku: 'PRD-US-FAS-43B',
        category: catBeauty._id,
        description: 'Premium pebbled Italian leather tote bag with gold-tone hardware and matching zip clutch bag.',
        short_description: 'Luxury Leather Handbag & Matching Clutch Set.',
        price_coins: 59250,
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'],
        stock: 50,
        weight_kg: 1.1,
        dimensions: { length_cm: 35, width_cm: 28, height_cm: 14 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Levi\'s 501 Original Fit Mens Denim Jeans',
        sku: 'PRD-US-FAS-43C',
        category: catBeauty._id,
        description: 'The original straight leg button fly denim jeans in authentic dark indigo blue wash.',
        short_description: 'Levi\'s 501 Original Fit Mens Denim Jeans.',
        price_coins: 66000,
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'],
        stock: 65,
        weight_kg: 0.8,
        dimensions: { length_cm: 30, width_cm: 25, height_cm: 6 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Lululemon Align High-Rise 25" Yoga Leggings',
        sku: 'PRD-US-FAS-43D',
        category: catBeauty._id,
        description: 'Ultra-soft Nulu fabric feels weightless, four-way stretch, sweat-wicking for workouts and casual wear.',
        short_description: 'Lululemon Align High-Rise Yoga Leggings.',
        price_coins: 73500,
        images: ['https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500'],
        stock: 60,
        weight_kg: 0.3,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 4 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'The North Face Antora Waterproof Hooded Rain Jacket',
        sku: 'PRD-US-FAS-43G',
        category: catBeauty._id,
        description: 'DryVent 2L waterproof, breathable, seam-sealed shell with 100% recycled nylon and adjustable hood.',
        short_description: 'The North Face Antora Waterproof Rain Jacket.',
        price_coins: 82500,
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=500'],
        stock: 45,
        weight_kg: 0.6,
        dimensions: { length_cm: 30, width_cm: 25, height_cm: 6 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Timberland 6-Inch Premium Waterproof Mens Boots',
        sku: 'PRD-US-FAS-43H',
        category: catBeauty._id,
        description: 'Iconic wheat nubuck leather waterproof boots with 400g PrimaLoft insulation and anti-fatigue footbeds.',
        short_description: 'Timberland 6-Inch Premium Waterproof Boots.',
        price_coins: 157500,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        stock: 40,
        weight_kg: 1.8,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Gucci GG Marmont Matelassé Leather Shoulder Bag',
        sku: 'PRD-US-FAS-43I',
        category: catBeauty._id,
        description: 'Crafted from black chevron matelassé leather with Double G antique gold hardware and sliding chain strap.',
        short_description: 'Gucci GG Marmont Matelassé Leather Bag.',
        price_coins: 420000,
        images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500'],
        stock: 15,
        weight_kg: 1.0,
        dimensions: { length_cm: 30, width_cm: 20, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Naija Crunchy Spicy Plantain Chips & Chin Chin Box',
        sku: 'PRD-GRO-46B',
        category: catFood._id,
        description: 'Assorted West African snacks including spicy plantain chips, crunchy sweet chin chin, and salted peanuts.',
        short_description: 'Naija Crunchy Snacks Variety Box.',
        price_coins: 21375,
        images: ['https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500'],
        stock: 90,
        weight_kg: 1.5,
        dimensions: { length_cm: 30, width_cm: 20, height_cm: 12 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Egusi & Ogbono Soup Ingredients Super Family Pack',
        sku: 'PRD-GRO-46C',
        category: catFood._id,
        description: 'Ground melon seeds (Egusi), wild mango seeds (Ogbono), dried crayfish, stockfish flakes & pepper mix.',
        short_description: 'Egusi & Ogbono Soup Ingredients Pack.',
        price_coins: 25125,
        images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500'],
        stock: 70,
        weight_kg: 2.5,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'California Organic Extra Virgin Olive Oil (3 Liters)',
        sku: 'PRD-GRO-46D',
        category: catFood._id,
        description: 'First cold pressed organic extra virgin olive oil harvested from California estate olive groves.',
        short_description: 'California Organic Extra Virgin Olive Oil 3L.',
        price_coins: 28500,
        images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'],
        stock: 65,
        weight_kg: 3.2,
        dimensions: { length_cm: 30, width_cm: 15, height_cm: 15 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Customized Printed Throw Pillow (Set of 2)',
        sku: 'PRD-HOM-48',
        category: catHome._id,
        description: 'Soft linen throw pillows printed with custom family photos or anniversary dates.',
        short_description: 'Customized Printed Throw Pillow Set.',
        price_coins: 14250,
        images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500'],
        stock: 80,
        weight_kg: 0.8,
        dimensions: { length_cm: 45, width_cm: 45, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Luxury Scented Soy Candles Gift Box (Set of 3)',
        sku: 'PRD-HOM-50',
        category: catHome._id,
        description: 'Hand-poured 100% natural soy wax candles with lavender, vanilla, and eucalyptus essential oil scents.',
        short_description: 'Luxury Scented Soy Candles Box (3 Set).',
        price_coins: 16875,
        images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500'],
        stock: 75,
        weight_kg: 1.1,
        dimensions: { length_cm: 25, width_cm: 10, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Nespresso Vertuo Pop+ Coffee & Espresso Machine',
        sku: 'PRD-HOM-50B',
        category: catHome._id,
        description: 'Compact pod coffee maker with Centrifusion extraction technology for barista-grade crema and coffee.',
        short_description: 'Nespresso Vertuo Pop+ Espresso Machine.',
        price_coins: 37500,
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
        stock: 50,
        weight_kg: 3.5,
        dimensions: { length_cm: 30, width_cm: 20, height_cm: 25 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Dyson V8 Cordless Vacuum Cleaner (Nickel/Cobalt)',
        sku: 'PRD-HOM-50C',
        category: catHome._id,
        description: 'Lightweight cordless stick vacuum with de-tangling Motorbar cleaner head, up to 40 minutes run time.',
        short_description: 'Dyson V8 Cordless Vacuum Cleaner.',
        price_coins: 98000,
        images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'],
        stock: 30,
        weight_kg: 2.6,
        dimensions: { length_cm: 125, width_cm: 25, height_cm: 22 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Armor All Ultimate 8-Piece Car Wash Bucket Kit',
        sku: 'PRD-US-AUT-52',
        category: catAuto._id,
        description: 'Includes Ultra Shinning Car Wash & Wax, Tire Foam Protectant, Glass Wipes, Microfiber Towel, and Wash Mitt.',
        short_description: 'Armor All 8-Piece Car Wash Kit.',
        price_coins: 22500,
        images: ['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500'],
        stock: 70,
        weight_kg: 3.5,
        dimensions: { length_cm: 30, width_cm: 25, height_cm: 25 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter',
        sku: 'PRD-US-AUT-53',
        category: catAuto._id,
        description: 'Safely jump start a dead battery in seconds. Rated for gasoline engines up to 6 liters and diesel engines up to 3 liters.',
        short_description: 'NOCO GB40 1000A Lithium Car Jump Starter.',
        price_coins: 61500,
        images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500'],
        stock: 55,
        weight_kg: 1.2,
        dimensions: { length_cm: 20, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'WeatherTech Custom-Fit All-Weather Car FloorMat Set',
        sku: 'PRD-US-AUT-53B',
        category: catAuto._id,
        description: 'Laser measured front and rear floor liners engineered to protect carpeted vehicle interiors from mud, snow, and spills.',
        short_description: 'WeatherTech Custom-Fit Car FloorMat Set.',
        price_coins: 75000,
        images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500'],
        stock: 45,
        weight_kg: 4.0,
        dimensions: { length_cm: 75, width_cm: 55, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Garmin Dash Cam 57 1440p Quad HD Driving Recorder',
        sku: 'PRD-US-AUT-54',
        category: catAuto._id,
        description: 'Wide 140-degree field of view captures clear 1440p HD video. Voice control, incident detection, and live view monitoring.',
        short_description: 'Garmin Dash Cam 57 Quad HD Driving Camera.',
        price_coins: 111000,
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=500'],
        stock: 40,
        weight_kg: 0.5,
        dimensions: { length_cm: 12, width_cm: 10, height_cm: 6 },
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
        stock: 80,
        weight_kg: 0.5,
        dimensions: { length_cm: 18, width_cm: 10, height_cm: 5 },
        package_type: 'box',
        fragile: false,
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
        stock: 40,
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
        images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500'],
        stock: 35,
        weight_kg: 4.2,
        dimensions: { length_cm: 35, width_cm: 25, height_cm: 12 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // --- NEW 48 REAL-LIFE PRODUCTS (TOTAL catalog = 129 items) ---
      {
        name: 'Papa John\'s Epic Stuffed Crust Cheese Pizza (14")',
        sku: 'PRD-FF-13',
        category: catFastFood._id,
        description: 'Original hand-tossed dough stuffed with real mozzarella cheese, signature tomato sauce, and 100% real cheese blend.',
        short_description: 'Papa John\'s 14" Stuffed Crust Pizza.',
        price_coins: 20250,
        images: ['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500'],
        stock: 80,
        weight_kg: 1.8,
        dimensions: { length_cm: 36, width_cm: 36, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Wendy\'s Baconator & Large Chocolate Frosty Shake Combo',
        sku: 'PRD-FF-14',
        category: catFastFood._id,
        description: 'Half-pound of fresh beef, six strips of crispy smoked bacon, American cheese, ketchup, mayo, with thick Frosty shake.',
        short_description: 'Wendy\'s Baconator & Frosty Shake Combo.',
        price_coins: 21000,
        images: ['https://images.unsplash.com/photo-1550547660-d9450f859349?w=500'],
        stock: 75,
        weight_kg: 1.4,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 12 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Panda Express Orange Chicken & Fried Rice Family Plate',
        sku: 'PRD-FF-15',
        category: catFastFood._id,
        description: 'Crispy boneless chicken bites tossed in sweet & spicy orange sauce over wok-fried egg rice and veggies.',
        short_description: 'Panda Express Orange Chicken & Fried Rice.',
        price_coins: 21750,
        images: ['https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500'],
        stock: 85,
        weight_kg: 1.5,
        dimensions: { length_cm: 28, width_cm: 22, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Subway Footlong Italian B.M.T. Sub Sandwich',
        sku: 'PRD-FF-16',
        category: catFastFood._id,
        description: 'Genoa salami, spicy pepperoni, Black Forest ham on toasted Parmesan Oregano bread with fresh lettuce, tomatoes & mayo.',
        short_description: 'Subway Footlong Italian B.M.T. Sub.',
        price_coins: 22500,
        images: ['https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500'],
        stock: 90,
        weight_kg: 0.9,
        dimensions: { length_cm: 32, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Starbucks Iced Caramel Macchiato & Chocolate Chip Muffin',
        sku: 'PRD-FF-17',
        category: catFastFood._id,
        description: 'Freshly brewed espresso with vanilla syrup, milk, ice, and buttery caramel drizzle served with rich chocolate chip muffin.',
        short_description: 'Starbucks Iced Caramel Macchiato & Muffin.',
        price_coins: 23250,
        images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500'],
        stock: 95,
        weight_kg: 0.8,
        dimensions: { length_cm: 20, width_cm: 15, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Texas Roadhouse USDA Choice 12oz Ribeye Steak Meal',
        sku: 'PRD-FF-18',
        category: catFastFood._id,
        description: '12oz hand-cut juicy USDA choice ribeye steak grilled over open flame with loaded baked potato and fresh rolls.',
        short_description: 'Texas Roadhouse 12oz Ribeye Steak Meal.',
        price_coins: 24000,
        images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=500'],
        stock: 60,
        weight_kg: 1.6,
        dimensions: { length_cm: 28, width_cm: 22, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: true
      },

      // Family Gift Boxes (+5)
      {
        name: 'Burt\'s Bees Natural Everyday Essential Body Care Gift Set',
        sku: 'PRD-GIF-17',
        category: catGifts._id,
        description: 'Includes Beeswax Lip Balm, Deep Cleansing Cream, Hand Salve, Body Lotion, and Coconut Foot Cream.',
        short_description: 'Burt\'s Bees Natural Everyday Gift Set.',
        price_coins: 24750,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
        stock: 75,
        weight_kg: 0.8,
        dimensions: { length_cm: 22, width_cm: 18, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Godiva Belgian Dark Chocolate Truffles Gift Box (24 Pc)',
        sku: 'PRD-GIF-18',
        category: catGifts._id,
        description: 'Decadent dark chocolate truffles filled with double dark ganache, salted caramel, and Aztec spice.',
        short_description: 'Godiva Belgian Dark Truffles Box (24 pc).',
        price_coins: 27000,
        images: ['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500'],
        stock: 65,
        weight_kg: 0.7,
        dimensions: { length_cm: 25, width_cm: 18, height_cm: 5 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Gourmet Fruit & Artisan Cheese Wooden Crate Gift Basket',
        sku: 'PRD-GIF-19',
        category: catGifts._id,
        description: 'Fresh Fuji apples, D\'Anjou pears, sharp cheddar cheese, dried cranberries, and roasted almonds in a wooden crate.',
        short_description: 'Gourmet Fruit & Cheese Wooden Crate Basket.',
        price_coins: 33000,
        images: ['https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500'],
        stock: 50,
        weight_kg: 3.2,
        dimensions: { length_cm: 36, width_cm: 28, height_cm: 16 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Custom Engraved Glass Photo Frame & Lavender Candle Set',
        sku: 'PRD-GIF-20',
        category: catGifts._id,
        description: 'Personalized 8x10 glass frame engraved with family names paired with hand-poured soy lavender candle.',
        short_description: 'Custom Glass Frame & Candle Gift Set.',
        price_coins: 36000,
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500'],
        stock: 55,
        weight_kg: 1.5,
        dimensions: { length_cm: 28, width_cm: 22, height_cm: 12 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Starbucks Coffee Beans & Stainless Thermal Tumbler Basket',
        sku: 'PRD-GIF-21',
        category: catGifts._id,
        description: 'Two 12oz Starbucks roast coffee bags, double-wall stainless travel tumbler, and dark chocolate bars.',
        short_description: 'Starbucks Coffee & Tumbler Gift Basket.',
        price_coins: 39000,
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'],
        stock: 60,
        weight_kg: 2.1,
        dimensions: { length_cm: 32, width_cm: 25, height_cm: 14 },
        package_type: 'box',
        fragile: false,
        featured: true
      },

      // Electronics & Tech (+8)
      {
        name: 'Apple MagSafe Battery Pack White for iPhone',
        sku: 'PRD-US-TEC-25I',
        category: catTech._id,
        description: 'Compact magnetic wireless charging battery pack seamlessly attaches to iPhone 12, 13, 14 & 15 models.',
        short_description: 'Apple MagSafe Battery Pack White.',
        price_coins: 42000,
        images: ['https://images.unsplash.com/photo-1609592424009-5407fa6d03d7?w=500'],
        stock: 80,
        weight_kg: 0.3,
        dimensions: { length_cm: 10, width_cm: 8, height_cm: 3 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'JBL Flip 6 Waterproof Portable Bluetooth Speaker',
        sku: 'PRD-US-TEC-25J',
        category: catTech._id,
        description: '2-way speaker system delivers loud, crystal clear, powerful sound. IP67 waterproof and 12 hours battery.',
        short_description: 'JBL Flip 6 Waterproof Bluetooth Speaker.',
        price_coins: 45000,
        images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500'],
        stock: 75,
        weight_kg: 0.6,
        dimensions: { length_cm: 18, width_cm: 8, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Razer BlackWidow V4 Pro Mechanical Gaming Keyboard',
        sku: 'PRD-US-TEC-25K',
        category: catTech._id,
        description: 'Chroma RGB per-key lighting, mechanical green clicky switches, command dial, 8 dedicated macro keys.',
        short_description: 'Razer BlackWidow V4 Pro Mechanical Keyboard.',
        price_coins: 67500,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
        stock: 45,
        weight_kg: 1.4,
        dimensions: { length_cm: 46, width_cm: 16, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Samsung T7 Shield 2TB Portable External SSD (Black)',
        sku: 'PRD-US-TEC-25L',
        category: catTech._id,
        description: 'Superfast read speeds up to 1050 MB/s, rugged IP65 water and dust resistant rubberized shell.',
        short_description: 'Samsung T7 Shield 2TB Portable SSD.',
        price_coins: 72000,
        images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500'],
        stock: 50,
        weight_kg: 0.2,
        dimensions: { length_cm: 9, width_cm: 6, height_cm: 2 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'GoPro HERO12 Black Waterproof 5.3K Action Camera',
        sku: 'PRD-US-TEC-25M',
        category: catTech._id,
        description: '5.3K60 video recording, HyperSmooth 6.0 stabilization, HDR photos, waterproof down to 33ft (10m).',
        short_description: 'GoPro HERO12 Black 5.3K Action Camera.',
        price_coins: 145000,
        images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'],
        stock: 35,
        weight_kg: 0.4,
        dimensions: { length_cm: 12, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'DJI Mini 4 Pro Fly More Combo Drone Camera (RC 2)',
        sku: 'PRD-US-TEC-25N',
        category: catTech._id,
        description: 'Under 249g ultra-light, 4K/60fps HDR video, omnidirectional obstacle sensing, 34-min flight time per battery.',
        short_description: 'DJI Mini 4 Pro Fly More Drone Camera.',
        price_coins: 260000,
        images: ['https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500'],
        stock: 20,
        weight_kg: 1.8,
        dimensions: { length_cm: 30, width_cm: 25, height_cm: 15 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Canon EOS R6 Mark II Mirrorless Camera Body',
        sku: 'PRD-US-TEC-25O',
        category: catTech._id,
        description: '24.2 MP full-frame CMOS sensor, 40 fps electronic shutter, 4K60p uncropped video, Dual Pixel CMOS AF II.',
        short_description: 'Canon EOS R6 Mark II Mirrorless Camera Body.',
        price_coins: 680000,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500'],
        stock: 15,
        weight_kg: 1.2,
        dimensions: { length_cm: 20, width_cm: 15, height_cm: 12 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'LG C3 65-inch 4K Smart OLED TV 120Hz (OLED65C3PSA)',
        sku: 'PRD-US-TEC-25P',
        category: catTech._id,
        description: 'Self-lit OLED pixels, α9 AI Processor Gen6, Dolby Vision & Atmos, 0.1ms response time, 4x HDMI 2.1 ports.',
        short_description: 'LG C3 65-inch 4K Smart OLED TV 120Hz.',
        price_coins: 720000,
        images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'],
        stock: 10,
        weight_kg: 22.0,
        dimensions: { length_cm: 145, width_cm: 85, height_cm: 15 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // Jewelry & Fine Accessories (+5)
      {
        name: '10K Solid Yellow Gold Franco Chain Necklace (22 Inch)',
        sku: 'PRD-JWL-30D',
        category: catJewelry._id,
        description: '2.5mm solid 10K yellow gold Franco link chain with lobster claw clasp. Polished mirror finish.',
        short_description: '10K Solid Gold Franco Chain 22".',
        price_coins: 49500,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        stock: 45,
        weight_kg: 0.3,
        dimensions: { length_cm: 12, width_cm: 10, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Swarovski Crystal Tennis Bracelet Rhodium Plated',
        sku: 'PRD-JWL-30E',
        category: catJewelry._id,
        description: 'Classic round clear Swarovski crystals set in rhodium-plated prongs with fold-over safety clasp.',
        short_description: 'Swarovski Crystal Tennis Bracelet.',
        price_coins: 52500,
        images: ['https://images.unsplash.com/photo-1611591475777-233ca73222d3?w=500'],
        stock: 50,
        weight_kg: 0.2,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: '14K Yellow Gold Classic Hoop Earrings (30mm)',
        sku: 'PRD-JWL-30F',
        category: catJewelry._id,
        description: 'Lightweight 14K solid yellow gold round polished hoops with secure snap-down latch closure.',
        short_description: '14K Gold Classic 30mm Hoop Earrings.',
        price_coins: 58500,
        images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500'],
        stock: 40,
        weight_kg: 0.2,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 4 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Custom Moissanite Iced Out Medallion Pendant Necklace',
        sku: 'PRD-JWL-30G',
        category: catJewelry._id,
        description: 'VVS D-Color moissanite stones set in 925 sterling silver plated in 14K gold. Passes diamond tester.',
        short_description: 'Iced Out Moissanite Medallion Pendant.',
        price_coins: 95000,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        stock: 30,
        weight_kg: 0.4,
        dimensions: { length_cm: 14, width_cm: 12, height_cm: 5 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Rolex Datejust 41mm Two-Tone Gold & Steel Watch',
        sku: 'PRD-JWL-30H',
        category: catJewelry._id,
        description: '18K yellow gold fluted bezel, champagne dial, Jubilee bracelet in Oystersteel and yellow gold.',
        short_description: 'Rolex Datejust 41mm Two-Tone Gold Watch.',
        price_coins: 520000,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        stock: 8,
        weight_kg: 0.9,
        dimensions: { length_cm: 15, width_cm: 15, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // Perfumes (+5)
      {
        name: 'Versace Eros Eau de Toilette Spray (100ml)',
        sku: 'PRD-PRF-38B',
        category: catPerfumes._id,
        description: 'Luminous aura with intense mint leaves, Italian lemon zest, green apple, tonka bean, and cedarwood.',
        short_description: 'Versace Eros Eau de Toilette Spray 100ml.',
        price_coins: 31500,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
        stock: 75,
        weight_kg: 0.5,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Paco Rabanne 1 Million Eau de Toilette (100ml)',
        sku: 'PRD-PRF-38C',
        category: catPerfumes._id,
        description: 'Spicy leather fragrance with notes of blood mandarin, cinnamon, rose, leather accord, and amber ketal.',
        short_description: 'Paco Rabanne 1 Million EDT 100ml.',
        price_coins: 34500,
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'],
        stock: 70,
        weight_kg: 0.5,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Yves Saint Laurent Y Eau de Parfum Spray (100ml)',
        sku: 'PRD-PRF-38D',
        category: catPerfumes._id,
        description: 'Bold woody aromatic fragrance blending crisp apple, sage, vetiver, and sensual tonka bean.',
        short_description: 'YSL Y Eau de Parfum Spray 100ml.',
        price_coins: 42000,
        images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500'],
        stock: 60,
        weight_kg: 0.5,
        dimensions: { length_cm: 14, width_cm: 10, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Parfums de Marly Layton Eau de Parfum (125ml)',
        sku: 'PRD-PRF-38E',
        category: catPerfumes._id,
        description: 'Distinguished oriental floral fragrance with apple, lavender, vanilla, pepper, and noble wood notes.',
        short_description: 'Parfums de Marly Layton EDP 125ml.',
        price_coins: 105000,
        images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500'],
        stock: 35,
        weight_kg: 0.7,
        dimensions: { length_cm: 16, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Louis Vuitton Ombre Nomade Eau de Parfum (100ml)',
        sku: 'PRD-PRF-38F',
        category: catPerfumes._id,
        description: 'Exclusive luxury oud fragrance with rare natural agarwood, raspberry, incense, and rose centifolia.',
        short_description: 'Louis Vuitton Ombre Nomade EDP 100ml.',
        price_coins: 145000,
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500'],
        stock: 25,
        weight_kg: 0.7,
        dimensions: { length_cm: 16, width_cm: 12, height_cm: 8 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // Beauty & Fashion (+6)
      {
        name: 'Nike Sportswear Club Fleece Pullover Hoodie (Black)',
        sku: 'PRD-US-FAS-43J',
        category: catBeauty._id,
        description: 'Brushed-back fleece fabric is soft and smooth, ribbed hem and cuffs, kangaroo pocket with embroidered Futura logo.',
        short_description: 'Nike Club Fleece Pullover Hoodie.',
        price_coins: 28500,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'],
        stock: 85,
        weight_kg: 0.7,
        dimensions: { length_cm: 30, width_cm: 25, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Adidas Originals Samba OG White Black Gum Sneakers',
        sku: 'PRD-US-FAS-43K',
        category: catBeauty._id,
        description: 'Full grain leather upper with gritty suede overlay, serrated 3-Stripes, and gum rubber outsole.',
        short_description: 'Adidas Originals Samba OG Sneakers.',
        price_coins: 43500,
        images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500'],
        stock: 70,
        weight_kg: 1.2,
        dimensions: { length_cm: 32, width_cm: 22, height_cm: 12 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Ugg Classic Short II Chestnut Sheepskin Boots',
        sku: 'PRD-US-FAS-43L',
        category: catBeauty._id,
        description: 'Twinface sheepskin pretreated to repel moisture and stains, Treadlite by UGG outsole for traction.',
        short_description: 'Ugg Classic Short II Chestnut Boots.',
        price_coins: 86000,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        stock: 50,
        weight_kg: 1.4,
        dimensions: { length_cm: 34, width_cm: 24, height_cm: 14 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Oakley Holbrook Matte Black Polarized Sport Sunglasses',
        sku: 'PRD-US-FAS-43M',
        category: catBeauty._id,
        description: 'O Matter frame material, Prizm Black Polarized lenses enhance color, contrast, and detail for outdoors.',
        short_description: 'Oakley Holbrook Polarized Sunglasses.',
        price_coins: 92000,
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
        stock: 45,
        weight_kg: 0.3,
        dimensions: { length_cm: 18, width_cm: 8, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Canada Goose Expedition Parka Down Jacket (Black)',
        sku: 'PRD-US-FAS-43N',
        category: catBeauty._id,
        description: '625 fill power white duck down insulation, Arctic Tech fabric, fleece-lined handwarmer pockets, rated for -30°C.',
        short_description: 'Canada Goose Expedition Down Parka Jacket.',
        price_coins: 380000,
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=500'],
        stock: 20,
        weight_kg: 2.5,
        dimensions: { length_cm: 45, width_cm: 35, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Louis Vuitton Neverfull MM Damier Ebene Tote Bag',
        sku: 'PRD-US-FAS-43O',
        category: catBeauty._id,
        description: 'Damier Ebene coated canvas with natural cowhide leather trim, red striped textile lining, and removable pouch.',
        short_description: 'Louis Vuitton Neverfull MM Tote Bag.',
        price_coins: 490000,
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'],
        stock: 12,
        weight_kg: 1.2,
        dimensions: { length_cm: 40, width_cm: 30, height_cm: 15 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // Food & Groceries (+4)
      {
        name: 'Ghirardelli Premium Baking Unsweetened Cocoa Powder (8 oz)',
        sku: 'PRD-GRO-46E',
        category: catFood._id,
        description: '100% unsweetened cocoa powder made from high quality roasted cocoa beans for cakes, brownies, and hot chocolate.',
        short_description: 'Ghirardelli Premium Baking Cocoa 8 oz.',
        price_coins: 12750,
        images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500'],
        stock: 90,
        weight_kg: 0.3,
        dimensions: { length_cm: 12, width_cm: 8, height_cm: 8 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'McCormick Grill Mates BBQ Seasoning Variety Pack (4 Jars)',
        sku: 'PRD-GRO-46F',
        category: catFood._id,
        description: 'Includes Montreal Steak, Montreal Chicken, Garlic Herb & Wine, and Mesquite seasoning blends.',
        short_description: 'McCormick Grill Mates BBQ Seasoning 4-Pack.',
        price_coins: 14250,
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500'],
        stock: 85,
        weight_kg: 0.8,
        dimensions: { length_cm: 20, width_cm: 15, height_cm: 10 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Bumble Bee Premium Solid White Albacore Tuna in Water (8 Pack)',
        sku: 'PRD-GRO-46G',
        category: catFood._id,
        description: 'Wild caught wild albacore tuna packed in water. High protein, non-GMO, gluten-free, 5 oz cans.',
        short_description: 'Bumble Bee Solid White Albacore Tuna 8-Pack.',
        price_coins: 16500,
        images: ['https://images.unsplash.com/photo-1584278860047-22db9f3788b6?w=500'],
        stock: 80,
        weight_kg: 1.6,
        dimensions: { length_cm: 25, width_cm: 15, height_cm: 10 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Filippo Berio Extra Virgin Olive Oil Tin (3 Liters)',
        sku: 'PRD-GRO-46H',
        category: catFood._id,
        description: 'Imported Italian extra virgin olive oil with well-balanced rich fruity flavor for dressings, marinades, and drizzling.',
        short_description: 'Filippo Berio Extra Virgin Olive Oil 3L Tin.',
        price_coins: 29500,
        images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'],
        stock: 60,
        weight_kg: 3.2,
        dimensions: { length_cm: 30, width_cm: 15, height_cm: 15 },
        package_type: 'box',
        fragile: false,
        featured: true
      },

      // Home & Living (+5)
      {
        name: 'Bialetti Moka Express 6-Cup Stovetop Espresso Maker',
        sku: 'PRD-HOM-50D',
        category: catHome._id,
        description: 'Made in Italy polished aluminum stovetop espresso maker produces 6 cups of rich authentic Italian espresso.',
        short_description: 'Bialetti Moka Express 6-Cup Espresso Maker.',
        price_coins: 19500,
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
        stock: 70,
        weight_kg: 0.9,
        dimensions: { length_cm: 18, width_cm: 12, height_cm: 22 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Lodge 10.25-inch Seasoned Cast Iron Skillet',
        sku: 'PRD-HOM-50E',
        category: catHome._id,
        description: 'Pre-seasoned with 100% natural vegetable oil, superior heat retention for searing, baking, broiling, and frying.',
        short_description: 'Lodge 10.25-inch Seasoned Cast Iron Skillet.',
        price_coins: 21000,
        images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500'],
        stock: 65,
        weight_kg: 2.4,
        dimensions: { length_cm: 40, width_cm: 27, height_cm: 5 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'Ninja Professional 1000W Countertop Blender (72 oz Pitcher)',
        sku: 'PRD-HOM-50F',
        category: catHome._id,
        description: 'Total Crushing technology pulverizes ice to snow in seconds for smoothies, frozen drinks, and sauces.',
        short_description: 'Ninja Professional 1000W Countertop Blender.',
        price_coins: 41250,
        images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500'],
        stock: 50,
        weight_kg: 3.8,
        dimensions: { length_cm: 25, width_cm: 20, height_cm: 42 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'Keurig K-Elite Single Serve K-Cup Pod Coffee Maker',
        sku: 'PRD-HOM-50G',
        category: catHome._id,
        description: 'Strong brew setting, iced coffee feature, 75oz water reservoir, brews 4, 6, 8, 10, and 12 oz cup sizes.',
        short_description: 'Keurig K-Elite Single Serve Pod Coffee Maker.',
        price_coins: 58500,
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
        stock: 40,
        weight_kg: 3.6,
        dimensions: { length_cm: 33, width_cm: 25, height_cm: 33 },
        package_type: 'box',
        fragile: true,
        featured: true
      },
      {
        name: 'iRobot Roomba i3+ EVO Self-Emptying Robot Vacuum',
        sku: 'PRD-HOM-50H',
        category: catHome._id,
        description: 'Empties itself into Clean Base for up to 60 days, smart mapping, 10x power-lifting suction, ideal for pet hair.',
        short_description: 'iRobot Roomba i3+ EVO Self-Emptying Vacuum.',
        price_coins: 145000,
        images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'],
        stock: 25,
        weight_kg: 6.8,
        dimensions: { length_cm: 40, width_cm: 35, height_cm: 45 },
        package_type: 'box',
        fragile: true,
        featured: true
      },

      // Automotive (+4)
      {
        name: 'Chemical Guys HOL148 16-Piece Arsenal Builder Car Wash Kit',
        sku: 'PRD-US-AUT-57',
        category: catAuto._id,
        description: 'Includes Torq Foam Blaster gun, Citrus Wash & Gloss, Butter Wet Wax, Silk Shine Dressing, Wheel Gel, and towels.',
        short_description: 'Chemical Guys 16-Piece Car Wash Kit with Foam Gun.',
        price_coins: 28500,
        images: ['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500'],
        stock: 60,
        weight_kg: 4.8,
        dimensions: { length_cm: 35, width_cm: 30, height_cm: 30 },
        package_type: 'box',
        fragile: false,
        featured: true
      },
      {
        name: 'Suaoki 800A Peak Portable Lithium Car Jump Starter Pack',
        sku: 'PRD-US-AUT-58',
        category: catAuto._id,
        description: '20,000mAh battery pack jump starts up to 6.0L gas or 5.0L diesel engines, dual USB charging ports and LED flashlight.',
        short_description: 'Suaoki 800A Portable Car Jump Starter Pack.',
        price_coins: 48000,
        images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500'],
        stock: 50,
        weight_kg: 1.1,
        dimensions: { length_cm: 20, width_cm: 12, height_cm: 6 },
        package_type: 'box',
        fragile: true,
        featured: false
      },
      {
        name: 'Bosch Icon 26A Premium All-Weather Beam Wiper Blade Pair',
        sku: 'PRD-US-AUT-59',
        category: catAuto._id,
        description: 'Exclusive FX dual rubber compound resists heat and ozone deterioration, 40% longer life than premium blades.',
        short_description: 'Bosch Icon 26A Premium Wiper Blade Pair.',
        price_coins: 52500,
        images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=500'],
        stock: 65,
        weight_kg: 0.8,
        dimensions: { length_cm: 68, width_cm: 8, height_cm: 4 },
        package_type: 'box',
        fragile: false,
        featured: false
      },
      {
        name: 'ChargePoint Home Flex Level 2 NEMA 14-50 EV Charger (50A)',
        sku: 'PRD-US-AUT-60',
        category: catAuto._id,
        description: 'Fast 240V Level 2 EV charging station up to 50 Amps, 9x faster than standard wall outlet. 23ft charging cable.',
        short_description: 'ChargePoint Home Flex 50A Level 2 EV Charger.',
        price_coins: 210000,
        images: ['https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=500'],
        stock: 25,
        weight_kg: 6.5,
        dimensions: { length_cm: 35, width_cm: 28, height_cm: 18 },
        package_type: 'box',
        fragile: true,
        featured: true
      }

    ]);

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

    // 8. Seed REAL-LIFE PHYSICAL Active Ads Marketplace Listings
    await AdCampaign.create([
      // REAL-LIFE PHYSICAL USA HOUSE AD
      {
        campaign_number: 'AD-MKT-001',
        user: adminUser._id,
        name: 'Luxury 5-Bedroom Executive House in Dallas, TX',
        business_name: 'Texas Heritage Luxury Realty',
        product_service: 'Real Estate & Properties',
        landing_page: 'https://zangi.com/dallas-house-realty',
        contact_info: '+1 (469) 555-0192',
        objective: 'Real Estate Ads',
        category: 'Real Estate Ads',
        platform: platFacebook._id,
        duration_hours: 168,
        creative: {
          headline: 'Modern 5-Bed 4.5-Bath Executive Home in Frisco, Dallas TX',
          copy: 'Stunning 2-story brick residence with 3-car garage, resort pool, open concept kitchen, and top ISD school district. Schedule a private walkthrough today.',
          destination_url: 'https://zangi.com/dallas-house-realty'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          original_name: 'real_usa_house_dallas.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', state: 'Texas (Houston/Dallas)', city: 'Dallas' }],
        impressions_views: 89400,
        clicks: 6720,
        status: 'ACTIVE',
        total_cost_coins: 49000,
        platform_budget_coins: 49000,
        management_fee_coins: 0,
        compliance_declared: true
      },
      // REAL-LIFE PHYSICAL FORD F-150 TRUCK AD
      {
        campaign_number: 'AD-MKT-002',
        user: adminUser._id,
        name: '2024 Ford F-150 Lariat 4x4 SuperCrew Truck',
        business_name: 'Lone Star Ford Dealership Houston',
        product_service: 'Vehicle Ads & Trucks',
        landing_page: 'https://lonestarford.com/f150-lariat',
        contact_info: '+1 (713) 555-8821',
        objective: 'Vehicle Ads',
        category: 'Vehicle Ads',
        platform: platTikTok._id,
        duration_hours: 120,
        creative: {
          headline: '2024 Ford F-150 Lariat 4x4 Truck Available in Houston',
          copy: '3.5L PowerBoost Full Hybrid V6, 7.2kW Pro Power Onboard generator, leather interior, and 12,000 lbs towing capacity. Low APR financing available.',
          destination_url: 'https://lonestarford.com/f150-lariat'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
          original_name: 'real_ford_f150_truck.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', state: 'Texas (Houston/Dallas)', city: 'Houston' }],
        impressions_views: 52100,
        clicks: 4190,
        status: 'ACTIVE',
        total_cost_coins: 35000,
        platform_budget_coins: 35000,
        management_fee_coins: 0,
        compliance_declared: true
      },
      // REAL-LIFE PHYSICAL MUSTANG GT SPORTS CAR AD
      {
        campaign_number: 'AD-MKT-003',
        user: adminUser._id,
        name: '2024 Mustang GT Fastback 5.0L V8 Coupe',
        business_name: 'California Performance Autos Los Angeles',
        product_service: 'Sports Cars & Vehicles',
        landing_page: 'https://caliperformance.com/mustang-gt',
        contact_info: '+1 (310) 555-4920',
        objective: 'Vehicle Ads',
        category: 'Vehicle Ads',
        platform: platSnapchat._id,
        duration_hours: 96,
        creative: {
          headline: '2024 Mustang GT Fastback Coupe 5.0L V8 in Los Angeles',
          copy: '486 Horsepower 5.0L Coyote V8 engine, 6-speed manual transmission, active valve performance exhaust, and B&O sound system. Drive home today.',
          destination_url: 'https://caliperformance.com/mustang-gt'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800',
          original_name: 'real_mustang_gt_car.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', state: 'California (Los Angeles/SF)', city: 'Los Angeles' }],
        impressions_views: 68300,
        clicks: 5320,
        status: 'ACTIVE',
        total_cost_coins: 28000,
        platform_budget_coins: 28000,
        management_fee_coins: 0,
        compliance_declared: true
      },
      // REAL-LIFE PHYSICAL TESLA MODEL 3 CAR AD
      {
        campaign_number: 'AD-MKT-004',
        user: adminUser._id,
        name: '2024 Tesla Model 3 Long Range Dual Motor AWD',
        business_name: 'Tesla Certified Pre-Owned Miami',
        product_service: 'Electric Vehicles',
        landing_page: 'https://tesla.com/miami-inventory',
        contact_info: '+1 (305) 555-7311',
        objective: 'Vehicle Ads',
        category: 'Vehicle Ads',
        platform: platFacebook._id,
        duration_hours: 144,
        creative: {
          headline: '2024 Tesla Model 3 Long Range AWD in Miami FL',
          copy: '341 miles EPA range, 0-60 mph in 4.2s, premium white interior with rear touchscreen display and Full Self-Driving hardware 4.0.',
          destination_url: 'https://tesla.com/miami-inventory'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
          original_name: 'real_tesla_model3_car.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', state: 'Florida (Miami)', city: 'Miami' }],
        impressions_views: 74200,
        clicks: 6180,
        status: 'ACTIVE',
        total_cost_coins: 42000,
        platform_budget_coins: 42000,
        management_fee_coins: 0,
        compliance_declared: true
      },
      // REAL-LIFE PHYSICAL NYC MANHATTAN CONDO AD
      {
        campaign_number: 'AD-MKT-005',
        user: adminUser._id,
        name: 'Luxury High-Rise Condo Rental in Midtown Manhattan',
        business_name: 'Manhattan Skyline Living New York',
        product_service: 'Apartments & Real Estate',
        landing_page: 'https://manhattanskyline.com/condo-rentals',
        contact_info: '+1 (212) 555-9082',
        objective: 'Apartment Ads',
        category: 'Apartment Ads',
        platform: platAllSocial._id,
        duration_hours: 168,
        creative: {
          headline: 'Luxury 2-Bedroom Condo with Central Park Views in NYC',
          copy: 'Floor-to-ceiling windows, Italian marble kitchen, rooftop infinity pool, 24-hour doorman and fitness center. Immediate occupancy.',
          destination_url: 'https://manhattanskyline.com/condo-rentals'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          original_name: 'real_nyc_condo_apartment.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', state: 'New York (NYC)', city: 'New York City' }],
        impressions_views: 91500,
        clicks: 7890,
        status: 'ACTIVE',
        total_cost_coins: 49000,
        platform_budget_coins: 49000,
        management_fee_coins: 0,
        compliance_declared: true
      },
      // REAL-LIFE HOOKUP & DATING AD
      {
        campaign_number: 'AD-MKT-006',
        user: adminUser._id,
        name: 'VIP Hookups & Adult Connections',
        business_name: 'VIP Connections Network',
        product_service: 'Adult Social & Hookups',
        landing_page: 'https://zangi.com/vip-hookups',
        contact_info: '+1 (555) 234-5678',
        objective: 'Hookup Ads',
        category: 'Hookup Ads',
        platform: platWhatsApp._id,
        duration_hours: 72,
        creative: {
          headline: 'Instant Hookups & Verified Matches in USA & UK',
          copy: 'Connect directly with active verified profiles in London, New York & Toronto. Discreet 24/7 service on WhatsApp & Zangi.',
          destination_url: 'https://zangi.com/vip-hookups'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
          original_name: 'vip_hookup.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', state: 'New York (NYC)', city: 'New York' }],
        impressions_views: 45200,
        clicks: 3410,
        status: 'ACTIVE',
        total_cost_coins: 21000,
        platform_budget_coins: 21000,
        management_fee_coins: 0,
        compliance_declared: true
      },
      // REAL-LIFE IPHONE 15 PRO MAX AD
      {
        campaign_number: 'AD-MKT-007',
        user: adminUser._id,
        name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
        business_name: 'iStore Express Atlanta',
        product_service: 'Smartphones & Electronics',
        landing_page: 'https://istoreexpress.com/iphone15promax',
        contact_info: '+1 (404) 555-2019',
        objective: 'Phone Ads',
        category: 'Phone Ads',
        platform: platWhatsApp._id,
        duration_hours: 96,
        creative: {
          headline: 'Factory Unlocked iPhone 15 Pro Max Natural Titanium',
          copy: 'Grade 5 Titanium frame, A17 Pro chip, 5x Telephoto optical camera. Shipped express nationwide across USA, UK and Nigeria.',
          destination_url: 'https://istoreexpress.com/iphone15promax'
        },
        media_files: [{
          url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
          original_name: 'real_iphone15_promax.jpg',
          file_type: 'image'
        }],
        target_locations: [{ country: 'United States', state: 'Georgia (Atlanta)', city: 'Atlanta' }],
        impressions_views: 63100,
        clicks: 5120,
        status: 'ACTIVE',
        total_cost_coins: 28000,
        platform_budget_coins: 28000,
        management_fee_coins: 0,
        compliance_declared: true
      }
    ]);

    console.log('Marketplace active real-life sample campaigns seeded across countries.');
    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedData();
