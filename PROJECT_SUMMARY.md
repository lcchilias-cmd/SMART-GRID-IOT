# 📦 Project Summary - Smart Grid IoT System

## ✨ What Has Been Built

A complete, **production-ready** IoT Smart Grid energy-consumption monitoring system with real-time data processing, MQTT communication, and a modern web dashboard.

### System Overview

```
IoT Devices (Simulated: 10 Homes)
           ↓
      MQTT Broker (Mosquitto)
           ↓
Backend Server (Express + Node.js)
    ├─ MQTT Client
    ├─ REST API
    ├─ WebSocket Server (Socket.IO)
    └─ MongoDB Connection
           ↓
      ├─ MongoDB (Data Storage)
      └─ React Dashboard (Next.js)
```

## 📁 Complete File Structure

```
smartgrid-iot/
├── ROOT FILES
│   ├── README.md                  # Full documentation
│   ├── QUICKSTART.md              # 5-minute quick start
│   ├── SETUP.md                   # VS Code setup guide
│   ├── PROJECT_SUMMARY.md         # This file
│   ├── docker-compose.yml         # Multi-container setup
│   ├── package.json               # Root npm scripts
│   ├── .env.example               # Environment template
│   ├── .gitignore                 # Git ignore rules
│   ├── start.sh                   # Mac/Linux start script
│   ├── start.bat                  # Windows start script
│   └── test-api.http              # API testing (VS Code)
│
├── BACKEND (Node.js + Express)
│   ├── server.js                  # Main server & MQTT handler
│   ├── init-db.js                 # Database initializer
│   ├── package.json               # Dependencies
│   ├── .env                       # Backend config
│   └── Dockerfile                 # Container image
│
├── FRONTEND (React + Next.js)
│   ├── package.json               # Dependencies
│   ├── next.config.js             # Next.js config
│   ├── .env.local                 # Frontend config
│   ├── Dockerfile                 # Container image
│   ├── pages/
│   │   ├── _app.js               # App wrapper with Socket.io
│   │   ├── index.js              # Home overview page
│   │   └── home/[homeId].js      # Per-home details page
│   ├── components/
│   │   ├── HomeCard.js           # Home consumption card
│   │   ├── PowerMeter.js         # Live circular gauge
│   │   ├── ConsumptionChart.js   # 24h line chart
│   │   ├── AlertsList.js         # Alert notifications
│   │   └── Statistics.js         # Aggregated stats
│   └── styles/
│       └── globals.css            # Complete styling
│
├── GENERATOR (IoT Simulator)
│   ├── generator.js               # MQTT data publisher
│   ├── package.json               # Dependencies
│   ├── .env                       # Generator config
│   └── Dockerfile                 # Container image
│
└── MOSQUITTO (MQTT Broker)
    └── config/
        └── mosquitto.conf         # MQTT configuration
```

## 🔧 Core Components

### 1. Backend Server (server.js)
**Features:**
- Express.js REST API
- MQTT Client subscribing to `home/+/consumption`
- WebSocket Server via Socket.io
- MongoDB integration
- Alert generation (HIGH > 1200W, LOW < 250W)
- 5 REST endpoints

**Routes:**
```
GET  /api/homes                    - List all homes
POST /api/homes                    - Create home
GET  /api/consumption/:homeId      - Latest consumption
GET  /api/consumption/:homeId/history - 24h history
GET  /api/alerts                   - Recent alerts
GET  /api/statistics               - Aggregated statistics
```

### 2. Frontend Dashboard
**Pages:**
- **Home** (`index.js`) - Overview with all homes grid
- **Home Detail** (`home/[homeId].js`) - Detailed per-home view

**Components:**
- **PowerMeter** - Animated circular gauge showing real-time watts
- **ConsumptionChart** - Recharts line chart with 24h history
- **HomeCard** - Grid card showing home with live consumption
- **AlertsList** - Formatted alert notifications
- **Statistics** - Total consumption, averages, highest consumer

**Features:**
- Real-time updates via WebSocket
- Responsive dark theme UI
- Live alert notifications
- 24-hour consumption history
- No page reload needed

### 3. IoT Generator (generator.js)
**Features:**
- Simulates 10 homes (H001-H010)
- Publishes random consumption (200-1500W) every 5 seconds
- MQTT protocol
- Automatic reconnection

### 4. Database Schema (MongoDB)

**Homes:**
```javascript
{
  homeId: String,      // Unique identifier
  address: String,     // Home address
  owner: String,       // Owner name
  createdAt: Date      // Creation timestamp
}
```

**Consumption Records:**
```javascript
{
  homeId: String,      // Home ID
  timestamp: Date,     // Reading time
  power: Number,       // Watts (W)
  unit: String         // "W"
}
```

**Alerts:**
```javascript
{
  homeId: String,      // Home ID
  timestamp: Date,     // Alert time
  type: String,        // "HIGH" or "LOW"
  value: Number,       // Power value (W)
  message: String      // Description
}
```

### 5. Docker Configuration
**Services:**
- **mosquitto** - MQTT Broker (eclipse-mosquitto)
- **mongodb** - Database (mongo:7.0)
- **backend** - API Server (node:18-alpine)
- **frontend** - Web Dashboard (node:18-alpine)
- **generator** - Data Simulator (node:18-alpine)
- **init** - Database Initializer (one-time run)

## 🚀 Quick Start Commands

### Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down

# Full reset
docker-compose down -v && docker-compose up -d --build
```

### Using Helper Scripts
**Windows:**
```bash
start.bat docker-up
start.bat docker-logs
start.bat docker-down
```

**Mac/Linux:**
```bash
./start.sh docker-up
./start.sh docker-logs
./start.sh docker-down
```

### Local Development
```bash
# Terminal 1: Backend
cd backend && npm install && npm start

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev

# Terminal 3: Generator
cd generator && npm install && npm start
```

## 📊 Access Points

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend Dashboard | http://localhost:3000 | Web UI |
| Backend API | http://localhost:5000 | REST API |
| MongoDB | localhost:27017 | Database |
| Mosquitto | localhost:1883 | MQTT Broker |
| Mosquitto WS | localhost:9001 | WebSocket MQTT |

## 🔌 MQTT Topics

| Topic | Type | Direction |
|-------|------|-----------|
| `home/{homeId}/consumption` | Publisher | Generator → Broker → Backend |
| `alerts/high` | Topic | Triggered when > 1200W |
| `alerts/low` | Topic | Triggered when < 250W |

## 📦 Dependencies

### Backend
- `express` - Web server framework
- `mongoose` - MongoDB ODM
- `mqtt` - MQTT client
- `socket.io` - Real-time communication
- `dotenv` - Environment variables
- `cors` - Cross-origin support

### Frontend
- `react` - UI library
- `next` - React framework
- `socket.io-client` - WebSocket client
- `recharts` - Chart library
- `axios` - HTTP client

### Generator
- `mqtt` - MQTT client
- `dotenv` - Environment variables

## 🎯 Data Flow

```
1. Generator publishes to MQTT:
   home/H001/consumption → 725.3W

2. Backend MQTT client receives:
   - Saves to MongoDB
   - Emits via WebSocket

3. Database stores:
   - ConsumptionRecord
   - Alert (if threshold crossed)

4. Frontend receives via WebSocket:
   - Updates power meter
   - Updates chart
   - Shows notification

5. Dashboard displays:
   - Real-time consumption
   - 24h history
   - Alerts
   - Statistics
```

## ✅ Features Implemented

- ✅ 10 simulated IoT homes
- ✅ MQTT-based communication
- ✅ Real-time data processing
- ✅ MongoDB data persistence
- ✅ WebSocket real-time updates
- ✅ REST API (5 endpoints)
- ✅ Responsive web dashboard
- ✅ Live power meter gauge
- ✅ 24-hour consumption chart
- ✅ Alert notifications
- ✅ Statistics aggregation
- ✅ Database initialization
- ✅ Docker containerization
- ✅ Helper scripts (Windows/Mac/Linux)
- ✅ Comprehensive documentation

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete architecture & features |
| `QUICKSTART.md` | 5-minute setup guide |
| `SETUP.md` | VS Code integration guide |
| `PROJECT_SUMMARY.md` | This overview |
| `docker-compose.yml` | Service configuration |
| `.env.example` | Environment variables template |
| `test-api.http` | API testing endpoints |

## 🛠️ Useful Commands

```bash
# Docker management
docker-compose ps                  # Show running containers
docker-compose logs -f             # View all logs
docker-compose logs -f backend     # Backend logs only

# Database access
docker-compose exec mongodb mongosh smartgrid
db.homes.find()
db.consumption_records.find().limit(5)
db.alerts.find().limit(5)

# MQTT testing
docker-compose exec mosquitto mosquitto_sub -h localhost -t "home/+/consumption"
docker-compose exec mosquitto mosquitto_pub -h localhost -t "home/H001/consumption" -m "750.5"

# API testing
curl http://localhost:5000/api/homes
curl http://localhost:5000/api/alerts
curl http://localhost:5000/api/statistics

# Service restart
docker-compose restart backend
docker-compose restart frontend
docker-compose restart generator
```

## 🐛 Troubleshooting

**Services won't start:**
```bash
docker system prune -a
docker-compose down -v
docker-compose up -d --build
```

**Port conflicts:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**MongoDB connection error:**
```bash
docker-compose restart mongodb
docker-compose logs mongodb
```

**Frontend can't connect to backend:**
- Verify `.env.local` has correct API URL
- Check backend is running: http://localhost:5000/api/homes
- Check CORS in backend/server.js

## 🎓 Learning Resources

- [MQTT Protocol](https://mqtt.org/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/)
- [Socket.IO Guide](https://socket.io/)
- [Docker Documentation](https://docs.docker.com/)

## 📞 Support

For issues:
1. Check **README.md** for architecture details
2. See **SETUP.md** for VS Code integration
3. Review logs: `docker-compose logs -f`
4. Verify connectivity to services
5. Check environment variables

## 🎉 Next Steps

1. **Start the system**: `docker-compose up -d`
2. **Open dashboard**: http://localhost:3000
3. **Explore homes**: Click on any home to see details
4. **Monitor data**: Check real-time consumption updates
5. **Test API**: Use `test-api.http` with REST Client
6. **Read docs**: Review README.md for full details

---

**Status:** ✅ Complete and Ready to Run

All components are fully functional and tested. The system can be deployed locally, in Docker, or to production environments.

Built with ❤️ for smart grid energy monitoring
