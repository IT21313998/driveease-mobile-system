const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const RentalBooking = require('./models/RentalBooking');

const sampleVehicles = [
  {
    model: 'Toyota Prius Hybrid 2018',
    category: 'Sedan',
    plateNumber: 'WP CAD-4821',
    dailyRate: 12000,
    seatingCapacity: 5,
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    description: 'Luxury hybrid sedan with excellent fuel economy (22+ km/l). Dual zone climate control, Bluetooth audio, reverse camera. Minimum 2 days rental with flexible mileage.'
  },
  {
    model: 'Honda Vezel RS Sensing 2019',
    category: 'SUV',
    plateNumber: 'WP CBG-9034',
    dailyRate: 16500,
    seatingCapacity: 5,
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    description: 'Spacious sporty compact SUV in pearl white. Leather interior, paddle shift, cruise control, Honda Sensing safety package. Ideal for family trips, outstation travel or weddings.'
  },
  {
    model: 'Suzuki Alto K10 VXi',
    category: 'Hatchback',
    plateNumber: 'WP BBD-1190',
    dailyRate: 6000,
    seatingCapacity: 4,
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    description: 'Most economical city runabout. Superb fuel efficiency, easy parking in Colombo traffic, fully air-conditioned with power shutters and Pioneer sound setup.'
  },
  {
    model: 'Toyota Land Cruiser Prado TX',
    category: 'SUV',
    plateNumber: 'WP KX-7722',
    dailyRate: 28000,
    seatingCapacity: 7,
    fuelType: 'Diesel',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    isAvailable: false,
    description: 'Full-size 7-seater 4WD luxury SUV. Sunroof, 360-degree cameras, cooler box, multi-terrain off-road drive modes. Perfect for executive transport, VIP airport pickups, and hill country tours.'
  },
  {
    model: 'Toyota Corolla Axio Hybrid',
    category: 'Sedan',
    plateNumber: 'WP CAA-5529',
    dailyRate: 10500,
    seatingCapacity: 5,
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    description: 'Smooth and reliable automatic hybrid sedan. Highly comfortable suspension, roomy boot for luggage, clean non-smoking interior.'
  },
  {
    model: 'Yamaha FZ-S Version 3.0',
    category: 'Motorbike',
    plateNumber: 'WP BHF-3341',
    dailyRate: 3500,
    seatingCapacity: 2,
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    description: 'Fuel-injected 150cc naked sports bike with single-channel ABS. Agile handling, comfortable upright seating, includes two sanitized full-face helmets.'
  },
  {
    model: 'Nissan Leaf Acenta EV',
    category: 'Hatchback',
    plateNumber: 'WP CAG-6618',
    dailyRate: 8500,
    seatingCapacity: 5,
    fuelType: 'Electric',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    description: '100% zero-emission electric vehicle. Whisper quiet drive, heated seats, e-Pedal technology. Includes portable home charging cable and rapid charging port access.'
  },
  {
    model: 'Honda Civic RS Turbo',
    category: 'Sedan',
    plateNumber: 'WP CBA-8822',
    dailyRate: 18000,
    seatingCapacity: 5,
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    description: '1.5L VTEC Turbo engine delivering exhilarating power. Black leather interior, Apple CarPlay/Android Auto, sunroof, RS bodykit and dual exhausts.'
  }
];

async function seedData() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected.');

    // 1. Ensure Admin Account exists
    let admin = await User.findOne({ email: 'admin@driveease.lk' });
    if (!admin) {
      admin = await User.create({
        name: 'DriveEase Fleet Manager',
        email: 'admin@driveease.lk',
        password: 'adminpassword123',
        role: 'admin'
      });
      console.log('Created Admin User: admin@driveease.lk / adminpassword123');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Ensure Customer Account exists
    let customer = await User.findOne({ email: 'kavindu@gmail.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Kavindu Rasara',
        email: 'kavindu@gmail.com',
        password: 'password123',
        role: 'customer'
      });
      console.log('Created Customer User: kavindu@gmail.com / password123');
    } else {
      console.log('Customer user kavindu@gmail.com found.');
    }

    // 3. Clear existing vehicles and re-seed with realistic listings
    await Vehicle.deleteMany({});
    console.log('Cleared old vehicles.');

    const insertedVehicles = await Vehicle.insertMany(sampleVehicles);
    console.log(`Successfully seeded ${insertedVehicles.length} vehicles!`);

    // 4. Create 1 sample active booking for the user to demonstrate
    await RentalBooking.deleteMany({});
    const prado = insertedVehicles.find(v => v.model.includes('Prado'));
    if (prado && customer) {
      const start = new Date();
      start.setDate(start.getDate() + 1);
      const end = new Date();
      end.setDate(end.getDate() + 4);

      await RentalBooking.create({
        vehicleId: prado._id,
        userId: customer._id,
        startDate: start,
        endDate: end,
        totalDays: 3,
        totalCost: 3 * prado.dailyRate,
        status: 'Confirmed',
        notes: 'VIP Nuwara Eliya family road trip. Extra roof luggage rack requested.'
      });
      console.log('Created sample active booking for Prado to demonstrate booking status!');
    }

    console.log('>>> ALL DATA SEEDED SUCCESSFULLY! <<<');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seedData();
