const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartgrid';
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.error('✗ MongoDB connection error:', err));

const HomeSchema = new mongoose.Schema({
  homeId: { type: String, unique: true, required: true },
  address: String,
  owner: String,
  createdAt: { type: Date, default: Date.now },
});

const ConsumptionRecordSchema = new mongoose.Schema({
  homeId: String,
  timestamp: { type: Date, default: Date.now },
  power: Number,
  unit: { type: String, default: 'W' },
});

const AlertSchema = new mongoose.Schema({
  homeId: String,
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['HIGH', 'LOW'] },
  value: Number,
  message: String,
});

const Home = mongoose.model('Home', HomeSchema);
const ConsumptionRecord = mongoose.model('ConsumptionRecord', ConsumptionRecordSchema);
const Alert = mongoose.model('Alert', AlertSchema);

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('✓ Connected to MQTT broker');
  mqttClient.subscribe('home/+/consumption', (err) => {
    if (err) console.error('MQTT subscription error:', err);
    else console.log('✓ Subscribed to home/+/consumption');
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    const [, homeId] = topic.split('/');
    const power = parseFloat(message.toString());

    if (isNaN(power)) return;

    const record = new ConsumptionRecord({
      homeId,
      power,
      timestamp: new Date(),
    });
    await record.save();

    io.emit('consumption_update', {
      homeId,
      power,
      timestamp: new Date(),
    });

    if (power > 1200) {
      const alert = new Alert({
        homeId,
        type: 'HIGH',
        value: power,
        message: `High consumption detected: ${power}W`,
        timestamp: new Date(),
      });
      await alert.save();
      io.emit('alert', {
        homeId,
        level: 'HIGH',
        value: power,
        timestamp: new Date(),
      });
    } else if (power < 250) {
      const alert = new Alert({
        homeId,
        type: 'LOW',
        value: power,
        message: `Low consumption detected: ${power}W`,
        timestamp: new Date(),
      });
      await alert.save();
      io.emit('alert', {
        homeId,
        level: 'LOW',
        value: power,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

io.on('connection', (socket) => {
  console.log('✓ Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('✗ Client disconnected:', socket.id);
  });
});

app.get('/api/homes', async (req, res) => {
  try {
    const homes = await Home.find();
    res.json(homes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/consumption/:homeId', async (req, res) => {
  try {
    const record = await ConsumptionRecord.findOne({ homeId: req.params.homeId }).sort({ timestamp: -1 });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/consumption/:homeId/history', async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const records = await ConsumptionRecord.find({
      homeId: req.params.homeId,
      timestamp: { $gte: twentyFourHoursAgo },
    }).sort({ timestamp: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/statistics', async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const records = await ConsumptionRecord.find({
      timestamp: { $gte: twentyFourHoursAgo },
    });

    const totalConsumption = records.reduce((sum, r) => sum + r.power, 0);
    const homeConsumption = {};
    records.forEach(r => {
      if (!homeConsumption[r.homeId]) homeConsumption[r.homeId] = 0;
      homeConsumption[r.homeId] += r.power;
    });

    const highestConsumer = Object.entries(homeConsumption).reduce((max, [homeId, consumption]) =>
      consumption > max.consumption ? { homeId, consumption } : max,
      { homeId: null, consumption: 0 }
    );

    res.json({
      totalConsumption,
      averageByHome: Object.keys(homeConsumption).length
        ? totalConsumption / Object.keys(homeConsumption).length
        : 0,
      highestConsumer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/homes', async (req, res) => {
  try {
    const home = new Home(req.body);
    await home.save();
    res.status(201).json(home);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Smart Grid IoT Backend running on http://localhost:${PORT}`);
  console.log(`📊 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

module.exports = { Home, ConsumptionRecord, Alert };
