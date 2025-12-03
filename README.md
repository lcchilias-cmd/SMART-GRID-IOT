# ⚡ Smart Grid IoT Energy Consumption Monitoring System

A complete real-time IoT Smart Grid energy-consumption monitoring system built with Node.js, React, MQTT, and MongoDB.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Smart Grid System                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  IoT Homes   │  │  IoT Homes   │  │  IoT Homes   │     │
│  │   H001-H010  │  │              │  │   (10 homes) │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │             │
│         └─────────────────┼─────────────────┘             │
│                           │                               │
│                    ┌──────▼───────┐                        │
│                    │   Mosquitto  │                        │
│                    │   (MQTT)     │                        │
│                    └──────┬───────┘                        │
│                           │                               │
│        ┌──────────────────┼──────────────────┐            │
│        │                  │                  │            │
│   ┌────▼────┐        ┌────▼────┐      ┌─────▼────┐       │
│   │ Backend  │◄──────►│ MongoDB │      │ Frontend │       │
│   │(Express) │        │(Storage)│      │(React)   │       │
│   └────┬─────┘        └─────────┘      └─────▲────┘       │
│        │                                      │            │
│        │             WebSocket                │            │
│        └──────────────────────────────────────┘            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 📋 Project Structure

```
smartgrid-iot/
├── backend/                 # Node.js Express Backend
│   ├── server.js           # Main server & MQTT handler
│   ├── package.json        # Dependencies
│   ├── .env               # Configuration
│   └── Dockerfile         # Docker image
├── frontend/              # React/Next.js Dashboard
│   ├── pages/
│   │   ├── _app.js       # App wrapper with socket.io
│   │   ├── index.js      # Home overview page
│   │   └── home/[homeId].js # Per-home details
│   ├── components/
│   │   ├── HomeCard.js   # Home consumption card
│   │   ├── PowerMeter.js # Live power gauge
│   │   ├── ConsumptionChart.js # 24h history
│   │   ├── AlertsList.js # Alert notifications
│   │   └── Statistics.js # Overall statistics
│   ├── styles/globals.css # Global styling
│   ├── .env.local        # Frontend config
│   ├── next.config.js    # Next.js config
│   ├── package.json      # Dependencies
│   └── Dockerfile        # Docker image
├── generator/            # IoT Data Generator
│   ├── generator.js      # MQTT publisher
│   ├── package.json      # Dependencies
│   ├── .env             # Configuration
│   └── Dockerfile       # Docker image
├── mosquitto/
│   └── config/mosquitto.conf # MQTT broker config
├── docker-compose.yml    # Multi-container orchestration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- npm or yarn

### Option 1: Docker Compose (Recommended)

```bash
# Navigate to project directory
cd smartgrid-iot

# Start all services
docker-compose up -d

# Wait for services to start (2-3 minutes)
docker-compose logs -f

# Stop all services
docker-compose down
```

**Access the application:**
- Frontend Dashboard: http://localhost:3000
- Backend API: http://localhost:5000
- Mosquitto MQTT: localhost:1883 (MQTT), localhost:9001 (WebSocket)
- MongoDB: localhost:27017

### Option 2: Local Development

#### 1. Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use local MongoDB installation
mongod
```

#### 2. Start Mosquitto MQTT Broker
```bash
# Using Docker
docker run -d -p 1883:1883 -p 9001:9001 --name mosquitto eclipse-mosquitto

# Or use local Mosquitto installation
mosquitto -c mosquitto/config/mosquitto.conf
```

#### 3. Start Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

#### 4. Start IoT Generator
```bash
cd generator
npm install
npm start
# Publishes data every 5 seconds
```

#### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## 📊 MongoDB Schema

### Homes Collection
```json
{
  "homeId": "H001",
  "address": "Example Street 12",
  "owner": "Random Name"
}
```

### Consumption Records Collection
```json
{
  "homeId": "H001",
  "timestamp": "2025-12-02T18:27:38Z",
  "power": 532.4,
  "unit": "W"
}
```

### Alerts Collection
```json
{
  "homeId": "H001",
  "timestamp": "2025-12-02T18:27:38Z",
  "type": "HIGH",
  "value": 1450.2,
  "message": "High consumption detected"
}
```

## 🔌 MQTT Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| `home/{homeId}/consumption` | Publisher → Broker | Energy consumption data (200-1500W) |
| `alerts/high` | Broker → Backend | Triggered when consumption > 1200W |
| `alerts/low` | Broker → Backend | Triggered when consumption < 250W |

## 🎨 Frontend Features

### Pages
- **Home Overview** - List all homes with real-time consumption
- **Per-Home Details** - Live power meter, 24h chart, alerts

### Widgets
- **Power Meter** - Animated circular gauge showing current consumption
- **Consumption Chart** - 24-hour history with Recharts
- **Statistics** - Total consumption, averages, highest consumer
- **Real-time Notifications** - Banner alerts for HIGH/LOW consumption
- **Alert History** - Recent alerts per home

### Real-time Updates
- WebSocket integration via Socket.io
- Live consumption updates without page reload
- Instant alert notifications

## 🔌 Backend API Endpoints

### Homes
```bash
GET /api/homes
# Returns list of all homes

POST /api/homes
# Create new home
# Body: { homeId, address, owner }
```

### Consumption
```bash
GET /api/consumption/:homeId
# Get latest consumption for a home

GET /api/consumption/:homeId/history
# Get 24-hour consumption history
```

### Alerts
```bash
GET /api/alerts
# Get recent 50 alerts
```

### Statistics
```bash
GET /api/statistics
# Get aggregated statistics
# Returns: totalConsumption, averageByHome, highestConsumer
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartgrid
MQTT_BROKER=mqtt://localhost:1883
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Generator (.env)
```env
MQTT_BROKER=mqtt://localhost:1883
NODE_ENV=development
```

## ⚠️ Alert Thresholds

- **HIGH Alert**: Consumption > 1200W
- **LOW Alert**: Consumption < 250W
- **Normal**: 250W - 1200W

## 📈 Data Generation

The IoT generator:
- Simulates 10 homes (H001-H010)
- Generates random consumption between 200W-1500W
- Publishes every 5 seconds via MQTT
- Automatically triggers alerts based on thresholds

## 🐳 Docker Compose Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| mosquitto | eclipse-mosquitto | 1883, 9001 | MQTT Broker |
| mongodb | mongo:7.0 | 27017 | Data Storage |
| backend | node:18-alpine | 5000 | API Server |
| frontend | node:18-alpine | 3000 | Web Dashboard |
| generator | node:18-alpine | - | Data Publisher |

## 🔍 Monitoring & Debugging

### Check Docker Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f generator
```

### Access MongoDB
```bash
# Connect to MongoDB
docker exec -it smartgrid-mongodb mongosh

# View databases
show dbs

# Switch to smartgrid
use smartgrid

# View collections
show collections

# Check consumption records
db.consumption_records.find().limit(5)
```

### Test MQTT
```bash
# Subscribe to home consumption
docker exec smartgrid-mosquitto mosquitto_sub -h localhost -t "home/+/consumption"

# Publish test message
docker exec smartgrid-mosquitto mosquitto_pub -h localhost -t "home/H001/consumption" -m "750.5"
```

## 🛑 Troubleshooting

### Services won't start
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :1883
netstat -ano | findstr :27017

# Kill process using port
taskkill /PID <PID> /F
```

### MongoDB connection error
```bash
# Ensure MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker restart smartgrid-mongodb
```

### Frontend can't connect to backend
- Verify backend is running: http://localhost:5000/api/homes
- Check CORS settings in backend/server.js
- Verify WebSocket URL in frontend .env.local

### MQTT publisher not receiving data
- Check generator service: `docker-compose logs generator`
- Verify MQTT broker is running: `docker ps | grep mosquitto`
- Test MQTT: `mosquitto_sub -h localhost -t home/+/consumption`

## 📦 Production Deployment

### Environment Setup
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy with production environment
docker-compose up -d
```

### Performance Optimization
- MongoDB indexing on homeId and timestamp
- MQTT QoS: 0 (fire-and-forget)
- WebSocket reconnection: 1-5 seconds
- Frontend caching: Next.js optimized build

## 📚 Additional Resources

- [MQTT Protocol](https://mqtt.org/)
- [Mosquitto Documentation](https://mosquitto.org/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/)
- [Socket.IO Guide](https://socket.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for educational and commercial purposes.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

Built with ❤️ for smart grid energy monitoring
