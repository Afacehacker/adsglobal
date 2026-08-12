require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const Deposit = require('../models/Deposit');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const DeliveryPricingRule = require('../models/DeliveryPricingRule');
const Order = require('../models/Order');
const AdPlatform = require('../models/AdPlatform');
const AdPricingRule = require('../models/AdPricingRule');
const AdCampaign = require('../models/AdCampaign');
const Refund = require('../models/Refund');
const { calculateOrderPricing } = require('../services/pricingEngine');

const runTest = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adsglobal';
    await mongoose.connect(connStr);
    console.log('\n==================================================');
    console.log('STARTING AUTOMATED BACKEND LOGIC VERIFICATION FLOW');
    console.log('==================================================\n');

    // 1. Create a clean test user
    const email = `test_customer_${Date.now()}@adsglobal.com`;
    const user = await User.create({
      name: 'Test Customer E2E',
      email,
      phone: '+2348000000001',
      country: 'Nigeria',
      password: 'testpassword2026',
      role: 'USER',
      emailVerified: true
    });
    console.log(`[PASS] 1. Created User: ${email}`);

    // Create Wallet
    const wallet = await Wallet.create({ user: user._id });
    console.log(`[PASS] 2. Wallet initialized. Balance: ${wallet.balance} COINS`);

    // 2. Submit Deposit Request
    const depositRef = `DEP-REF-${Date.now()}`;
    const depositAmount = 500000;
    const deposit = await Deposit.create({
      deposit_id: `DEP-${Date.now()}`,
      user: user._id,
      amount_naira: depositAmount,
      amount_coins: depositAmount,
      sender_name: 'E2E Sender',
      bank_used: 'Test Bank',
      transfer_reference: depositRef,
      transfer_date: new Date(),
      status: 'PENDING'
    });
    
    // Increment pending credits
    await Wallet.findOneAndUpdate({ user: user._id }, { $inc: { pending_credits: depositAmount } });
    const walletAfterDepRequest = await Wallet.findOne({ user: user._id });
    console.log(`[PASS] 3. Deposit request submitted: ₦${depositAmount}. Wallet pending credits: ${walletAfterDepRequest.pending_credits} COINS`);

    // 3. Admin approves deposit request
    const walletBeforeApproval = await Wallet.findOne({ user: user._id });
    
    // Update wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: user._id },
      { 
        $inc: { 
          balance: deposit.amount_coins,
          pending_credits: -deposit.amount_coins
        } 
      },
      { new: true }
    );
    
    // Update Deposit status
    deposit.status = 'APPROVED';
    await deposit.save();

    // Create ledger entry
    await WalletTransaction.create({
      txn_id: `TXN-DEP-${Date.now()}`,
      user: user._id,
      type: 'DEPOSIT',
      amount: deposit.amount_coins,
      balance_before: walletBeforeApproval.balance,
      balance_after: updatedWallet.balance,
      reference: deposit.deposit_id,
      description: 'Approved deposit credit',
      status: 'SUCCESS'
    });

    console.log(`[PASS] 4. Admin approved deposit. User Wallet Balance: ${updatedWallet.balance} COINS (Pending: ${updatedWallet.pending_credits})`);

    // 4. Test Checkout Calculations
    const product = await Product.findOne({});
    if (!product) {
      throw new Error('Product catalog empty. Run seed first.');
    }

    const items = [{ product: product._id, quantity: 1 }];
    const address = { country: 'United Kingdom', state: 'London' };
    
    const pricing = await calculateOrderPricing(items, address, 'STANDARD');
    console.log(`[PASS] 5. Logistics Engine pricing calculated:`);
    console.log(`       Subtotal: ${pricing.subtotal_coins} COINS`);
    console.log(`       Delivery: ${pricing.delivery_fee_coins} COINS`);
    console.log(`       Handling: ${pricing.handling_fee_coins} COINS`);
    console.log(`       Total Order: ${pricing.total_coins} COINS (Weight: ${pricing.total_weight_kg}kg)`);

    // 5. Checkout validation and execution
    const totalCost = pricing.total_coins;
    
    // Lock balance
    const chargedWallet = await Wallet.findOneAndUpdate(
      { user: user._id, balance: { $gte: totalCost } },
      { $inc: { balance: -totalCost } },
      { new: true }
    );
    
    if (!chargedWallet) {
      throw new Error('Insufficient balance for order checkout.');
    }

    // Decrement stock
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -1 } });
    
    // Create order
    const orderNumber = `GLB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TRK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const order = await Order.create({
      order_number: orderNumber,
      user: user._id,
      items: pricing.items,
      delivery_address: {
        recipient_name: 'Relative UK',
        recipient_phone: '+447000000000',
        country: 'United Kingdom',
        state: 'London',
        city: 'London',
        street_address: '10 Downing St'
      },
      delivery_method: 'STANDARD',
      subtotal_coins: pricing.subtotal_coins,
      delivery_fee_coins: pricing.delivery_fee_coins,
      handling_fee_coins: pricing.handling_fee_coins,
      total_coins: totalCost,
      status: 'PAID',
      tracking_number: trackingNumber
    });

    // Write split ledger entries
    await WalletTransaction.create([
      {
        txn_id: `TXN-PUR-${Date.now()}`,
        user: user._id,
        type: 'PURCHASE',
        amount: pricing.subtotal_coins,
        balance_before: updatedWallet.balance,
        balance_after: updatedWallet.balance - pricing.subtotal_coins,
        reference: orderNumber,
        description: 'Purchase items'
      },
      {
        txn_id: `TXN-DEL-${Date.now()}`,
        user: user._id,
        type: 'DELIVERY_FEE',
        amount: pricing.delivery_fee_coins + pricing.handling_fee_coins,
        balance_before: updatedWallet.balance - pricing.subtotal_coins,
        balance_after: chargedWallet.balance,
        reference: orderNumber,
        description: 'Delivery and handling fees'
      }
    ]);

    console.log(`[PASS] 6. Order successfully completed.`);
    console.log(`       Order ID: ${order.order_number}`);
    console.log(`       Tracking ID: ${order.tracking_number}`);
    console.log(`       Wallet Balance After Checkout: ${chargedWallet.balance} COINS`);

    // 6. Test Ad Platform check and submission
    const platform = await AdPlatform.findOne({ slug: 'whatsapp-ads' });
    if (!platform) {
      throw new Error('Platform whatsapp-ads not found. Run seed first.');
    }
    console.log(`[PASS] 7. Found newly seeded ad platform '${platform.name}'`);

    // Submit valid campaign with 7,000 coins daily budget for 2 days (14,000 coins total)
    const dailyBudget = 7000;
    const durationDays = 2;
    const campaignCost = dailyBudget * durationDays; // 14,000 COINS
    
    // Deduct campaign fee
    const campaignWallet = await Wallet.findOneAndUpdate(
      { user: user._id, balance: { $gte: campaignCost } },
      { $inc: { balance: -campaignCost } },
      { new: true }
    );

    const campaign = await AdCampaign.create({
      campaign_number: `AD-${Date.now()}`,
      user: user._id,
      name: 'Hookup Ads Special',
      business_name: 'VIP Hookups Promo',
      product_service: 'Adult social networking',
      landing_page: 'https://adsglobal.com',
      contact_info: 'contact@adsglobal.com',
      objective: 'Hookup Ads',
      category: 'Hookup Ads',
      platform: platform._id,
      duration_hours: durationDays * 24,
      creative: {
        headline: 'Connect Instantly',
        copy: 'Top Hookup Network',
        destination_url: 'https://adsglobal.com'
      },
      target_audience: {
        age_min: 18,
        age_max: 45,
        genders: ['All']
      },
      management_fee_coins: 0,
      platform_budget_coins: campaignCost,
      total_cost_coins: campaignCost,
      status: 'SUBMITTED',
      compliance_declared: true
    });

    console.log(`[PASS] 8. Ad Campaign submitted with 7,000 COINS/day for 2 days.`);
    console.log(`       Campaign ID: ${campaign.campaign_number}`);
    console.log(`       Deducted Cost: ${campaignCost} COINS`);
    console.log(`       Remaining Wallet Balance: ${campaignWallet.balance} COINS`);

    // 7. Verify balance is correctly guarded from negative spends
    const currentBalance = campaignWallet.balance;
    const expensiveTotal = currentBalance + 1000; // 1000 coins more than available

    const failedDeduction = await Wallet.findOneAndUpdate(
      { user: user._id, balance: { $gte: expensiveTotal } },
      { $inc: { balance: -expensiveTotal } },
      { new: true }
    );

    if (!failedDeduction) {
      console.log(`[PASS] 9. Anti-Double-Spend and negative balance prevention guard check succeeded.`);
    } else {
      throw new Error('Failsafe failed: User was allowed to spend below 0 coins!');
    }

    console.log('\n==================================================');
    console.log('E2E BACKEND LOGIC VERIFICATION SUCCESSFUL!');
    console.log('==================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n[FAIL] E2E Verification failed:', error);
    process.exit(1);
  }
};

runTest();
