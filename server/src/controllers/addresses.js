const DeliveryAddress = require('../models/DeliveryAddress');

// @desc    Get user's saved addresses
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await DeliveryAddress.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
exports.createAddress = async (req, res, next) => {
  try {
    const { recipient_name, recipient_phone, recipient_email, country, state, city, zip, street_address, apartment, landmark, instructions, isDefault } = req.body;

    if (!recipient_name || !recipient_phone || !country || !state || !city || !street_address) {
      return res.status(400).json({ error: 'Please provide all required address fields' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await DeliveryAddress.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await DeliveryAddress.create({
      user: req.user._id,
      recipient_name,
      recipient_phone,
      recipient_email,
      country,
      state,
      city,
      zip,
      street_address,
      apartment,
      landmark,
      instructions,
      isDefault: isDefault || false
    });

    res.status(201).json({
      success: true,
      message: 'Address saved successfully',
      address
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete saved address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await DeliveryAddress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
