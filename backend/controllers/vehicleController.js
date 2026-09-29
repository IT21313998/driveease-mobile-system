const Vehicle = require('../models/Vehicle');
const RentalBooking = require('../models/RentalBooking');

// @desc    Get all vehicles (with optional category & availability filter)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const { category, isAvailable, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    if (search) {
      query.model = { $regex: search, $options: 'i' };
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vehicle (with image upload)
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = async (req, res) => {
  try {
    const {
      model,
      category,
      plateNumber,
      dailyRate,
      seatingCapacity,
      fuelType,
      description
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a vehicle image' });
    }

    const plateExists = await Vehicle.findOne({ plateNumber: plateNumber.toUpperCase() });
    if (plateExists) {
      return res.status(400).json({ message: 'Vehicle with this plate number already exists' });
    }

    // Relative image path for client rendering
    const imageUrl = `/uploads/${req.file.filename}`;

    const vehicle = await Vehicle.create({
      model,
      category,
      plateNumber: plateNumber.toUpperCase(),
      dailyRate: Number(dailyRate),
      seatingCapacity: Number(seatingCapacity),
      fuelType,
      description,
      image: imageUrl,
      isAvailable: true
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vehicle details
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const {
      model,
      category,
      plateNumber,
      dailyRate,
      seatingCapacity,
      fuelType,
      description,
      isAvailable
    } = req.body;

    vehicle.model = model || vehicle.model;
    vehicle.category = category || vehicle.category;
    vehicle.plateNumber = plateNumber ? plateNumber.toUpperCase() : vehicle.plateNumber;
    vehicle.dailyRate = dailyRate !== undefined ? Number(dailyRate) : vehicle.dailyRate;
    vehicle.seatingCapacity = seatingCapacity !== undefined ? Number(seatingCapacity) : vehicle.seatingCapacity;
    vehicle.fuelType = fuelType || vehicle.fuelType;
    vehicle.description = description !== undefined ? description : vehicle.description;
    if (isAvailable !== undefined) {
      vehicle.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    if (req.file) {
      vehicle.image = `/uploads/${req.file.filename}`;
    }

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if there are active bookings for this vehicle
    const activeBooking = await RentalBooking.findOne({
      vehicleId: vehicle._id,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (activeBooking) {
      return res.status(400).json({
        message: 'Cannot delete vehicle: active or pending rental bookings exist for this vehicle.'
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
