# ⚡ Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Docker Desktop installed and running
- Git (optional)
- 5 GB free disk space

### Start the Project

```bash
# 1. Open terminal/command prompt in project directory

# 2. Start all services
docker-compose up -d

# 3. Wait 2-3 minutes for services to initialize

# 4. Access the dashboard
# Open browser: http://localhost:3000
```

**That's it!** 🎉

### What's Running?

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3000 | Main UI |
| Backend API | http://localhost:5000 | REST API |
| Mosquitto | localhost:1883 | MQTT Broker |
| MongoDB | localhost:27017 | Database |

## ✅ Verify It's Working

### Option 1: Browser Check
1. Open http://localhost:3000
2. You should see homes listed with live consumption data
3. Click on a home to see detailed view

### Option 2: Terminal Check

```bash
# Check running services
docker-compose ps

# Should show 5 running containers:
# - smartgrid-mosquitto
# - smartgrid-mongodb  
# - smartgrid-backend
# - smartgrid-frontend
# - smartgrid-generator

# Check API
curl http://localhost:5000/api/homes

# Should return JSON array of homes
```

## 🔧 Common Tasks

### View Dashboard
```bash
# Simply open in browser
http://localhost:3000
```

### Check Data Generation
```bash
# Watch generator logs
docker-compose logs -f generator
```

### Monitor Backend
```bash
# View API logs
docker-compose logs -f backend
```

### Access MongoDB
```bash
# Query consumption data
docker-compose exec mongodb mongosh smartgrid
db.consumption_records.find().limit(5)
```

### Stop Everything
```bash
docker-compose down
```

### Full Reset (WARNING: Deletes all data)
```bash
docker-compose down -v
docker-compose up -d
```

## 📊 What You're Seeing

### Dashboard Features
- **Home Overview**: List of 10 simulated homes (H001-H010)
- **Live Power Meter**: Real-time consumption reading
- **24h History**: Chart showing past 24 hours
- **Alerts**: Red/blue notifications for high/low consumption
- **Statistics**: Total consumption, averages

### Data Generation
- 10 simulated homes generating data
- New readings every 5 seconds
- Consumption: 200-1500W
- Alerts triggered at:
  - RED (HIGH): > 1200W
  - BLUE (LOW): < 250W

## 🎯 Next Steps

1. **Explore Dashboard**: http://localhost:3000
   - View real-time consumption
   - Check 24-hour history
   - Review alerts

2. **Test API**: 
   ```bash
   curl http://localhost:5000/api/homes
   curl http://localhost:5000/api/alerts
   curl http://localhost:5000/api/statistics
   ```

3. **Monitor Data**: 
   ```bash
   docker-compose logs -f
   ```

4. **Read Documentation**: 
   - [README.md](README.md) - Full architecture
   - [SETUP.md](SETUP.md) - Detailed setup for VS Code
   - [docker-compose.yml](docker-compose.yml) - Service configuration

## 🐛 Troubleshooting

### Services won't start?
```bash
# Check logs
docker-compose logs

# Ensure Docker is running
docker ps

# Try rebuilding
docker-compose down -v
docker-compose up -d --build
```

### Dashboard shows "Loading" forever?
```bash
# Check backend is responding
curl http://localhost:5000/api/homes

# If error, restart backend
docker-compose restart backend
```

### No data appearing?
```bash
# Check generator is running
docker-compose logs generator

# Check MongoDB has data
docker-compose exec mongodb mongosh smartgrid
db.consumption_records.count()
```

### Port already in use?
```bash
# Find process using port (example: 5000)
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

## 📞 Need Help?

- Check [README.md](README.md) for architecture details
- See [SETUP.md](SETUP.md) for VS Code integration
- Review logs: `docker-compose logs -f [service]`
- Verify ports are available: `netstat -ano` (Windows) or `lsof -i` (Mac/Linux)

## 🎓 Learning Resources

- [MQTT Protocol](https://mqtt.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [Next.js/React](https://nextjs.org/)
- [Socket.IO](https://socket.io/)

---

**Enjoy monitoring! 🚀**
