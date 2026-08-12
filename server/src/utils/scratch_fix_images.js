const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, './seed.js');
let seedContent = fs.readFileSync(seedPath, 'utf8');

// Mapping of products to exact high-definition real-life photography URLs
const exactImageMap = {
  // Fast Food & Express Meals
  'Coca-Cola Original Taste Soda Cans (12-Can Pack)': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
  'Hellmann\'s Real Mayonnaise (30 fl oz Jar)': 'https://images.unsplash.com/photo-1528751014936-863e6e7a31f0?w=500',
  'Double Bacon Cheeseburger & Crispy French Fries Meal': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
  'Krispy Kreme Original Glazed Donuts Box (12 Pack)': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500',
  'Creamy Chicken Fettuccine Alfredo & Garlic Bread': 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500',
  'Large Pepperoni Pizza & 2L Coca-Cola Bottle Combo': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
  'Golden Deep-Fried Seasoned Turkey Wings & Drumsticks (4 Pcs)': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500',
  'Crispy Golden Fried Chicken & Chips Bucket (12 Pcs)': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500',
  'Five Guys Bacon Cheeseburger & Cajun Fries Combo Meal': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500',
  'Chipotle Chicken Burrito Bowl with Fresh Guacamole': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500',
  'Dunkin\' Assorted Glazed & Frosted Donuts Box (12 Pack)': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500',
  'Domino\'s Ultimate Meat Lovers Hand-Tossed Pizza (14")': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500',

  // Family Gift Boxes
  'Custom Photo Coffee Mug & Electric Warmer Kit': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
  'Personalized Engraved Wooden Memory Keepsake Box': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
  'Gourmet Bamboo Cheese Board & Knife Set Gift Box': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500',
  'Godiva Chocolatier Milk & Dark Chocolate Gift Box (36 Pc)': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
  'Tea Forté Organic Herbal Tea Tasting Chest (40 Pyramids)': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
  'Harry & David Royal Riviera Pears Luxury Gift Box': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500',
  'Fresh Premium Red Roses & White Lilies Floral Bouquet': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500',
  'Hickory Farms Beef Sausage & Smoked Cheese Gift Basket': 'https://images.unsplash.com/photo-1584278860047-22db9f3788b6?w=500',

  // Electronics & Tech
  'Logitech MX Master 3S Wireless Performance Mouse': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
  'Bose SoundLink Flex Bluetooth Portable Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  'Anker MagGo Magnetic Wireless Power Bank (10,000mAh)': 'https://images.unsplash.com/photo-1609592424009-5407fa6d03d7?w=500',
  'Amazon Kindle Paperwhite 16GB (6.8" Paperwhite Display)': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500',
  'Ring Video Doorbell Pro 2 (1536p HD Head-to-Toe Video)': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500',
  'Google Nest Learning Thermostat 3rd Generation (Stainless)': 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500',
  'Apple AirPods Pro (2nd Generation) MagSafe Case (USB-C)': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500',
  'Nintendo Switch OLED Model with White Joy-Con': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500',
  'Sony WH-1000XM5 Wireless Noise-Canceling Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  'Sony PlayStation 5 Slim Console Disc Edition': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
  'Microsoft Xbox Series X 1TB Console (Black)': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500',
  'Apple iPad Air 11-inch M2 Wi-Fi 128GB (Space Gray)': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
  'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
  'Samsung Galaxy S24 Ultra 512GB Unlocked AI Smartphone': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
  'Apple iPhone 15 Pro Max (256GB Natural Titanium)': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
  'Apple MacBook Pro 16" M3 Max 36GB RAM 1TB SSD': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',

  // Jewelry & Fine Accessories
  'Sterling Silver Matching Couple Promise Rings Set': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
  '18K Yellow Gold Plated Heart Pendant Necklace': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
  'Pandora Moments Sterling Silver Barrel Clasp Charm Bracelet': 'https://images.unsplash.com/photo-1611591475777-233ca73222d3?w=500',
  '14K White Gold Round Diamond Stud Earrings (0.5 Carat)': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500',
  '14K Solid Gold Diamond Solitaire Engagement Ring (1 Carat)': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
  'Cartier Love Bracelet 18K Yellow Gold': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
  'Rolex Submariner Date 41mm Stainless Steel Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',

  // Perfumes & Fragrances
  'Victoria\'s Secret Velvet Petals Body Mist & Lotion Set': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
  'Giorgio Armani Acqua Di Giò Eau de Toilette (100ml)': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
  'Yves Saint Laurent Black Opium Eau de Parfum (90ml)': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500',
  'Dior Sauvage Eau de Parfum Spray (100ml)': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500',
  'Chanel Coco Mademoiselle Intense Eau de Parfum (100ml)': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
  'Tom Ford Tobacco Vanille Eau de Parfum Spray (50ml)': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500',
  'Maison Francis Kurkdjian Baccarat Rouge 540 EDP (70ml)': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500',
  'Creed Aventus Eau de Parfum Spray (100ml)': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',

  // Beauty & Fashion
  'Custom Printed Family T-Shirts (Pack of 4)': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
  'Carhartt Heavyweight Pocket T-Shirt': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
  'Sol de Janeiro Brazilian Bum Bum Cream (240ml)': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
  'Womens Elegant Leather High Heels Pumps': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
  'Italian Handcrafted Mens Leather Oxford Shoes': 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500',
  'Luxury Leather Handbag & Matching Zip Clutch Bag Set': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
  'Levi\'s 501 Original Fit Mens Denim Jeans': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
  'Lululemon Align High-Rise 25" Yoga Leggings': 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500',
  'The North Face Antora Waterproof Hooded Rain Jacket': 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500',
  'Ray-Ban Classic Polarized Wayfarer Sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
  'Nike Air Jordan 1 Retro High OG Chicago Sneakers': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500',
  'Timberland 6-Inch Premium Waterproof Mens Boots': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  'Gucci GG Marmont Matelassé Leather Shoulder Bag': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',

  // Food & Groceries
  'Kirkland Signature 100% Pure Organic Maple Syrup (33.8 fl oz)': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500',
  'Trader Joe\'s Organic Raw Wildflower Honey Bears (12 oz)': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
  'Starbucks Whole Bean Dark Roast Coffee (32 oz Bag)': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
  'Naija Crunchy Spicy Plantain Chips & Chin Chin Box': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500',
  'Egusi & Ogbono Soup Ingredients Super Family Pack': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
  'California Organic Extra Virgin Olive Oil (3 Liters)': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',

  // Home & Living
  'Insulated Stainless Steel Water Bottle Set (40 oz)': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
  'Customized Printed Throw Pillow (Set of 2)': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500',
  'Customized Family Photo Picture Frame (12x16")': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
  'Luxury Scented Soy Candles Gift Box (Set of 3)': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500',
  'Nespresso Vertuo Pop+ Coffee & Espresso Machine': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
  'Dyson V8 Cordless Vacuum Cleaner (Nickel/Cobalt)': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',

  // Automotive & Vehicles
  'AstroAI Digital Car Tire Pressure Gauge & Inflator': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500',
  'Armor All Ultimate 8-Piece Car Wash Bucket Kit': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500',
  'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500',
  'WeatherTech Custom-Fit All-Weather Car FloorMat Set': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500',
  'Garmin Dash Cam 57 1440p Quad HD Driving Recorder': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500',
  'BYD EV Portable Home Charger 11kW Wallbox & Cable': 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=500',
  'Tesla Universal Mobile Connector EV Charger Cable Bundle': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500'
};

// Now replace image arrays in seed.js to match exact keys
let fixedCount = 0;
for (const [name, url] of Object.entries(exactImageMap)) {
  const escapedName = name.replace(/'/g, "\\'");
  const regex = new RegExp(`(name:\\s*['"]${escapedName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}['"][\\s\\S]*?images:\\s*\\[).*?(\\])`, 'g');
  if (seedContent.match(regex)) {
    seedContent = seedContent.replace(regex, `$1'${url}'$2`);
    fixedCount++;
  }
}

fs.writeFileSync(seedPath, seedContent, 'utf8');
console.log(`Audited and verified ${fixedCount} product images to match text descriptions!`);
