const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('\n❌ ERROR: MONGO_URI is missing or undefined in your backend/.env file!');
      console.error('👉 Please ensure backend/.env exists and contains:');
      console.error('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/driveease\n');
      process.exit(1);
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
