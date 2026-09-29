const RentalBooking = require('../models/RentalBooking');
const Vehicle = require('../models/Vehicle');

// @desc    Create new rental booking (Enforces core business logic)
// @route   POST /api/rentals
// @access  Private
const createRental = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, notes } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Vehicle, start date, and end date are required' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // BUSINESS LOGIC RULE 1: Check availability
    if (!vehicle.isAvailable) {
      return res.status(400).json({
        message: 'This vehicle is currently unavailable or already rented out.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Date validity validation
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format provided' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be strictly after start date' });
    }

    // BUSINESS LOGIC RULE 2: Server-calculated duration & total cost
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (totalDays <= 0) {
      return res.status(400).json({ message: 'Minimum rental duration is 1 day' });
    }

    const totalCost = totalDays * vehicle.dailyRate;

    // Create the booking
    const booking = await RentalBooking.create({
      vehicleId,
      userId: req.user._id,
      startDate: start,
      endDate: end,
      totalDays,
      totalCost,
      status: 'Confirmed', // Auto-confirmed on creation
      notes
    });

    // BUSINESS LOGIC RULE 3: Mark vehicle as unavailable upon confirmation
    vehicle.isAvailable = false;
    await vehicle.save();

    const populatedBooking = await RentalBooking.findById(booking._id).populate('vehicleId');
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/rentals/my-rentals
// @access  Private
const getMyRentals = async (req, res) => {
  try {
    const rentals = await RentalBooking.find({ userId: req.user._id })
      .populate('vehicleId')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rentals (Admin view)
// @route   GET /api/rentals
// @access  Private/Admin
const getAllRentals = async (req, res) => {
  try {
    const rentals = await RentalBooking.find()
      .populate('vehicleId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single rental booking by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = async (req, res) => {
  try {
    const rental = await RentalBooking.findById(req.params.id)
      .populate('vehicleId')
      .populate('userId', 'name email');

    if (!rental) {
      return res.status(404).json({ message: 'Rental booking not found' });
    }

    // Ensure only the owner or an admin can view this booking
    if (rental.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update rental status (state change & vehicle availability synchronization)
// @route   PUT /api/rentals/:id/status
// @access  Private
const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const rental = await RentalBooking.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental booking not found' });
    }

    // Check authorization: customer can only cancel their own booking; admin can set any status
    if (req.user.role !== 'admin' && rental.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (req.user.role !== 'admin' && status !== 'Cancelled') {
      return res.status(403).json({ message: 'Customers can only cancel their reservations' });
    }

    const previousStatus = rental.status;
    rental.status = status;
    await rental.save();

    // BUSINESS LOGIC RULE: Synchronize vehicle availability based on state change
    const vehicle = await Vehicle.findById(rental.vehicleId);
    if (vehicle) {
      if (status === 'Confirmed') {
        vehicle.isAvailable = false;
        await vehicle.save();
      } else if (status === 'Completed' || status === 'Cancelled') {
        // Releases vehicle back to available pool
        vehicle.isAvailable = true;
        await vehicle.save();
      }
    }

    const updatedRental = await RentalBooking.findById(rental._id).populate('vehicleId');
    res.json(updatedRental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete rental record
// @route   DELETE /api/rentals/:id
// @access  Private
const deleteRental = async (req, res) => {
  try {
    const rental = await RentalBooking.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental booking not found' });
    }

    if (req.user.role !== 'admin' && rental.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    // If an active booking is deleted, make sure the vehicle is released back to available
    if (['Pending', 'Confirmed'].includes(rental.status)) {
      const vehicle = await Vehicle.findById(rental.vehicleId);
      if (vehicle) {
        vehicle.isAvailable = true;
        await vehicle.save();
      }
    }

    await RentalBooking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rental booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRental,
  getMyRentals,
  getAllRentals,
  getRentalById,
  updateRentalStatus,
  deleteRental
};
