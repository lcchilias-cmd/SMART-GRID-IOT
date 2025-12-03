const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartgrid';

const HomeSchema = new mongoose.Schema({
  homeId: { type: String, unique: true, required: true },
  address: String,
  owner: String,
  createdAt: { type: Date, default: Date.now },
});

const Home = mongoose.model('Home', HomeSchema);

const sampleHomes = [
  { homeId: 'H001', address: '123 Main Street', owner: 'John Smith' },
  { homeId: 'H002', address: '456 Oak Avenue', owner: 'Maria Garcia' },
  { homeId: 'H003', address: '789 Pine Road', owner: 'David Johnson' },
  { homeId: 'H004', address: '321 Elm Court', owner: 'Sarah Williams' },
  { homeId: 'H005', address: '654 Maple Drive', owner: 'Michael Brown' },
  { homeId: 'H006', address: '987 Cedar Lane', owner: 'Emily Davis' },
  { homeId: 'H007', address: '147 Birch Street', owner: 'James Miller' },
  { homeId: 'H008', address: '258 Spruce Way', owner: 'Jennifer Wilson' },
  { homeId: 'H009', address: '369 Ash Boulevard', owner: 'Robert Moore' },
  { homeId: 'H010', address: '741 Willow Path', owner: 'Lisa Anderson' },
];

async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    const existingCount = await Home.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ Database already contains ${existingCount} homes. Skipping initialization.`);
      process.exit(0);
    }

    const result = await Home.insertMany(sampleHomes);
    console.log(`✓ Created ${result.length} sample homes`);

    sampleHomes.forEach(home => {
      console.log(`  - ${home.homeId}: ${home.address} (${home.owner})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
