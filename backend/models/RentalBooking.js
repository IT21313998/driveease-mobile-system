const mongoose = require('mongoose');

const rentalBookingSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Rental start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Rental end date is required']
    },
    totalDays: {
      type: Number,
      required: [true, 'Total rental duration in days is required'],
      min: [1, 'Rental period must be at least 1 day']
    },
    totalCost: {
      type: Number,
      required: [true, 'Total rental cost is required'],
      min: [0, 'Total cost cannot be negative']
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RentalBooking', rentalBookingSchema);
