# 🤖 CLAUDE.md - Essential Development Notes

This file contains quick reference information for developers and future AI assistants working on this project.

## 🚀 Quick Start

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Access dashboard
# http://localhost:3000

# Full reset
docker-compose down -v && docker-compose up -d --build
```

## 📊 Project Architecture

**Type:** IoT Smart Grid Monitoring System
**Stack:** Node.js, React/Next.js, MQTT, MongoDB, Express
**Containers:** 5 (Mosquitto, MongoDB, Backend, Frontend, Generator)
**Ports:** 3000 (Frontend), 5000 (API), 1883 (MQTT), 27017 (MongoDB)

## 📁 Key Files & Locations

### Core Backend
- **server.js** - Main Express API + MQTT client + WebSocket
- **init-db.js** - Database initialization (creates 10 sample homes)

### Frontend
- **pages/index.js** - Home overview page
- **pages/home/[homeId].js** - Per-home details page
- **components/PowerMeter.js** - Live consumption gauge
- **components/ConsumptionChart.js** - 24h history chart
- **styles/globals.css** - All styling

### Generator
- **generator.js** - MQTT publisher (10 homes, 200-1500W, every 5s)

### Configuration
- **docker-compose.yml** - Service orchestration
- **backend/.env** - Backend config
- **frontend/.env.local** - Frontend config
- **generator/.env** - Generator config
- **mosquitto/config/mosquitto.conf** - MQTT broker config

## 🔌 API Endpoints

```
GET  /api/homes                    # All homes
POST /api/homes                    # Create home
GET  /api/consumption/:homeId      # Latest consumption
GET  /api/consumption/:homeId/history  # 24h history
GET  /api/alerts                   # Recent alerts
GET  /api/statistics               # Aggregated stats
```

## 📡 MQTT Topics

```
home/{homeId}/consumption  # Generator → Backend
alerts/high               # Backend trigger
alerts/low                # Backend trigger
```

## 🎨 Frontend Components

| Component | Purpose | Location |
|-----------|---------|----------|
| PowerMeter | Live gauge | components/PowerMeter.js |
| ConsumptionChart | 24h history | components/ConsumptionChart.js |
| HomeCard | Grid card | components/HomeCard.js |
| AlertsList | Notifications | components/AlertsList.js |
| Statistics | Aggregate stats | components/Statistics.js |

## 🗄️ Database Collections

### homes
```json
{
  "homeId": "H001",
  "address": "123 Main Street",
  "owner": "John Smith"
}
```

### consumption_records
```json
{
  "homeId": "H001",
  "timestamp": "2025-12-02T18:27:38Z",
  "power": 532.4,
  "unit": "W"
}
```

### alerts
```json
{
  "homeId": "H001",
  "timestamp": "2025-12-02T18:27:38Z",
  "type": "HIGH|LOW",
  "value": 1450.2,
  "message": "High consumption detected"
}
```

## 📦 Environment Variables

### Backend (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartgrid
MQTT_BROKER=mqtt://localhost:1883
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Generator (generator/.env)
```
MQTT_BROKER=mqtt://localhost:1883
NODE_ENV=development
```

## ⚙️ Alert Thresholds

- **HIGH**: > 1200W (red notification)
- **LOW**: < 250W (blue notification)
- **NORMAL**: 250-1200W (green indicator)

## 🔧 Commands for Development

```bash
# Backend development
cd backend
npm install
npm start                 # Runs on :5000
npm run dev              # Watch mode

# Frontend development
cd frontend
npm install
npm run dev              # Runs on :3000

# Generator
cd generator
npm install
npm start                # Publishes every 5s

# Database init
cd backend
npm run init-db          # Creates 10 sample homes

# MongoDB queries
docker-compose exec mongodb mongosh smartgrid
db.homes.find()
db.consumption_records.count()
db.alerts.find().limit(10)

# MQTT test
docker-compose exec mosquitto mosquitto_sub -h localhost -t "home/+/consumption"

# API test
curl http://localhost:5000/api/homes
```

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up -d --build

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f generator
docker-compose logs -f mongodb

# Execute command in container
docker-compose exec backend npm run init-db
docker-compose exec mongodb mongosh

# Restart service
docker-compose restart backend

# Stop all
docker-compose down

# Remove all (including volumes)
docker-compose down -v

# Check status
docker-compose ps
```

## 📝 Important Notes

- **10 Homes Simulated:** H001 through H010
- **Data Generation:** Every 5 seconds
- **Real-time Updates:** Via WebSocket (Socket.IO)
- **Default Port:** Frontend: 3000, Backend: 5000
- **Database:** MongoDB runs in container
- **MQTT Broker:** Mosquitto in container
- **Persistence:** Data persists in Docker volumes

## 🛠️ Debugging Tips

### Frontend Not Loading
- Check `.env.local` has correct API URL
- Verify backend is running: `curl http://localhost:5000/api/homes`
- Check browser console for errors

### No Data Appearing
- Check generator logs: `docker-compose logs generator`
- Verify MQTT connection: `docker-compose logs mosquitto`
- Check MongoDB data: `docker-compose exec mongodb mongosh smartgrid`

### Backend Connection Issues
- Verify MongoDB is healthy: `docker-compose logs mongodb`
- Check MQTT broker: `docker-compose logs mosquitto`
- Restart backend: `docker-compose restart backend`

### Port Conflicts (Windows)
```batch
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Port Conflicts (Mac/Linux)
```bash
lsof -i :5000
kill -9 <PID>
```

## 📚 Documentation Files

- **README.md** - Full architecture and features
- **QUICKSTART.md** - 5-minute setup
- **SETUP.md** - VS Code integration
- **PROJECT_SUMMARY.md** - Complete overview
- **test-api.http** - API endpoints for testing
- **.env.example** - Environment template

## ✅ Deployment Checklist

- [ ] All services start with `docker-compose up -d`
- [ ] Frontend loads at http://localhost:3000
- [ ] API responds at http://localhost:5000/api/homes
- [ ] Data appears in real-time on dashboard
- [ ] Alerts trigger correctly
- [ ] MongoDB stores consumption records
- [ ] Generator publishes every 5 seconds
- [ ] WebSocket real-time updates work

## 🔐 Security Notes

- MQTT allows anonymous connections (mosquitto.conf)
- No authentication on API endpoints
- Environment variables contain sensitive config
- .env files should not be committed
- Use proper secrets management in production

## 🎯 Future Enhancements

- [ ] User authentication/authorization
- [ ] Multiple tenant support
- [ ] Data export (CSV/PDF)
- [ ] Advanced analytics
- [ ] Predictive alerts
- [ ] Mobile app
- [ ] Email/SMS notifications
- [ ] Webhook integrations

## 📞 Support Commands

```bash
# Full system status
docker-compose ps && echo "" && curl http://localhost:5000/api/homes 2>/dev/null || echo "API not responding"

# Quick reset
docker-compose down -v && docker-compose up -d && sleep 10 && docker-compose logs -f

# Resource usage
docker stats

# Container inspection
docker inspect smartgrid-backend
```

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Services won't start | `docker-compose down -v && docker-compose up -d --build` |
| Port in use | Kill process using port, or restart Docker |
| No data | Check generator logs and MQTT connection |
| Frontend white page | Check browser console, verify backend URL |
| Database errors | Restart MongoDB: `docker-compose restart mongodb` |
| WebSocket timeout | Check Socket.io connection in browser console |

## 📋 Testing Workflows

### Test API
```bash
# Use test-api.http with REST Client extension in VS Code
# Or use curl:
curl http://localhost:5000/api/homes
curl http://localhost:5000/api/alerts
```

### Test MQTT
```bash
docker-compose exec mosquitto mosquitto_sub -h localhost -t "home/+/consumption"
# Should see messages every 5 seconds
```

### Test Database
```bash
docker-compose exec mongodb mongosh smartgrid
db.consumption_records.find().limit(3)
```

---

**Last Updated:** 2025-12-02
**Status:** ✅ Production Ready
**Version:** 1.0.0
