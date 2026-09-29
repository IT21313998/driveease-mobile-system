const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, 'Please provide vehicle model'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Hatchback', 'Motorbike'],
      required: [true, 'Please select a valid category']
    },
    plateNumber: {
      type: String,
      required: [true, 'Please provide vehicle registration/plate number'],
      unique: true,
      trim: true,
      uppercase: true
    },
    dailyRate: {
      type: Number,
      required: [true, 'Please specify the daily rental rate in USD/LKR'],
      min: [0, 'Daily rate cannot be negative']
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Please provide seating capacity'],
      min: [1, 'Capacity must be at least 1']
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      required: [true, 'Please specify fuel type']
    },
    image: {
      type: String,
      required: [true, 'Please upload a vehicle image']
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
