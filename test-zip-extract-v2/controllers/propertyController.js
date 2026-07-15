const Property = require('../models/propertyModel');

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'approved' });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch properties for logged in host
// @route   GET /api/properties/host
// @access  Private/Host
const getProviderProperties = async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch ALL properties (any status) for Admin
// @route   GET /api/properties/admin/all
// @access  Private/Admin
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('host', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin/Vendor
const createProperty = async (req, res) => {
  try {
    const { title, description, price, images, amenities, type, location } = req.body;

    const property = new Property({
      title,
      description,
      price,
      images,
      amenities,
      type,
      location,
      coordinates: req.body.coordinates || undefined,
      host: req.user._id,
      status: 'pending',
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: 'Invalid property data', error: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin/Vendor
const updateProperty = async (req, res) => {
  try {
    const { title, description, price, images, amenities, type, location } = req.body;

    const property = await Property.findById(req.params.id);

    if (property) {
      // Security: Check ownership
      if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not own this property' });
      }

      property.title = title || property.title;
      property.description = description || property.description;
      property.price = price || property.price;
      property.images = images || property.images;
      property.amenities = amenities || property.amenities;
      property.type = type || property.type;
      property.location = location || property.location;
      
      if (req.body.coordinates) {
        property.coordinates = req.body.coordinates;
      }

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update a property status (Approve/Reject)
// @route   PUT /api/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const property = await Property.findById(req.params.id);

    if (property) {
      property.status = status;
      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Toggle property featured status
// @route   PUT /api/properties/:id/featured
// @access  Private/Admin
const togglePropertyFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      property.isFeatured = !property.isFeatured;
      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin/Vendor
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      // Security: Check ownership
      if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not own this property' });
      }

      await Property.deleteOne({ _id: property._id });
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProperties,
  getProviderProperties,
  getAllPropertiesAdmin,
  getPropertyById,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  togglePropertyFeatured,
  deleteProperty,
};
