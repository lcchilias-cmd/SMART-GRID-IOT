# 🔧 Setup Guide for VS Code

## Prerequisites

Before starting, ensure you have:

1. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
   - Windows: Requires WSL 2 (Windows Subsystem for Linux)
   - Mac: Intel or Apple Silicon
   - Linux: Docker & Docker Compose

2. **VS Code** - [Download](https://code.visualstudio.com/)

3. **Recommended Extensions:**
   ```
   - Docker (ms-aztools.vscode-docker)
   - MongoDB for VS Code (mongodb.mongodb-vscode)
   - REST Client (humao.rest-client)
   - Thunder Client (rangav.vscode-thunder-client)
   ```

## Step 1: Prepare Your System

### Windows Users

1. Install Docker Desktop with WSL 2
2. Open PowerShell as Administrator
3. Verify installation:
   ```powershell
   docker --version
   docker-compose --version
   ```

### Mac/Linux Users

1. Install Docker Desktop or Docker Engine
2. Open Terminal
3. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

## Step 2: Start Services with Docker Compose

### Option A: Using VS Code Terminal

1. Open the project folder in VS Code: `File → Open Folder`
2. Open integrated terminal: `Ctrl + ` ` (backtick)
3. Run:
   ```bash
   docker-compose up -d
   ```
4. Monitor with:
   ```bash
   docker-compose logs -f
   ```

### Option B: Using VS Code Docker Extension

1. Install the Docker extension
2. Click Docker icon in sidebar
3. Navigate to `smartgrid-iot` folder
4. Right-click `docker-compose.yml`
5. Select "Compose Up"

### Option C: Manual Command (CMD/PowerShell)

```bash
cd path\to\smartgrid-iot
docker-compose up -d
```

## Step 3: Verify Services Are Running

### In VS Code:
1. Click Docker icon (left sidebar)
2. Expand "Containers"
3. Verify these containers exist:
   - `smartgrid-mosquitto` ✓
   - `smartgrid-mongodb` ✓
   - `smartgrid-backend` ✓
   - `smartgrid-frontend` ✓
   - `smartgrid-generator` ✓

### Via Terminal:
```bash
docker ps
```

Should show 5 running containers.

## Step 4: Wait for Full Startup (2-3 minutes)

Check logs for readiness:
```bash
# Backend ready
docker-compose logs backend | grep "running on"

# Frontend ready
docker-compose logs frontend | grep "Ready in"

# Generator running
docker-compose logs generator | grep "started"
```

## Step 5: Access the Dashboard

### Frontend
- URL: http://localhost:3000
- Status: Should display all homes with real-time consumption

### Backend API Health
- URL: http://localhost:5000/api/homes
- Should return JSON array of homes

### MQTT Broker Health
```bash
docker exec smartgrid-mosquitto mosquitto_pub -h localhost -t "test/health" -m "ok"
```

## VS Code Debugging Setup

### Backend Debugging

1. Create `.vscode/launch.json` in project root:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Backend Debug",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/backend/server.js",
         "restart": true,
         "console": "integratedTerminal",
         "env": {
           "NODE_ENV": "development"
         }
       }
     ]
   }
   ```

2. Press `F5` to start debugging

### Frontend Development

```bash
# In VS Code terminal
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

## Useful VS Code Commands

| Command | Purpose |
|---------|---------|
| `Ctrl + ` ` | Open integrated terminal |
| `Ctrl + K` + `Ctrl + O` | Open folder |
| `Ctrl + Shift + D` | Open debug panel |
| `Ctrl + Shift + X` | Open extensions |
| `F5` | Start debugging |
| `Ctrl + C` | Stop running process |

## VS Code Workspace Setup

Create `smartgrid-iot.code-workspace`:

```json
{
  "folders": [
    {
      "path": "backend",
      "name": "Backend"
    },
    {
      "path": "frontend",
      "name": "Frontend"
    },
    {
      "path": "generator",
      "name": "Generator"
    }
  ],
  "settings": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
  }
}
```

Open with: `File → Open Workspace from File`

## Docker-Specific VS Code Features

### View Logs
1. Click Docker icon
2. Right-click container
3. Select "View Logs"

### Execute Command in Container
1. Right-click container
2. Select "Exec"
3. Type command in terminal

### Restart Service
1. Right-click container
2. Select "Restart"

## Common Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop all services
docker-compose stop

# Start all services
docker-compose start

# Remove all services (careful!)
docker-compose down

# Remove with volumes (full reset)
docker-compose down -v

# Check service status
docker-compose ps

# Rebuild images
docker-compose build

# Execute command in service
docker-compose exec backend npm run dev

# Access MongoDB shell
docker-compose exec mongodb mongosh

# Access generator logs
docker-compose logs generator -f
```

## Testing via REST Client in VS Code

Create `test-api.http`:

```http
### Get all homes
GET http://localhost:5000/api/homes

### Get consumption history
GET http://localhost:5000/api/consumption/H001/history

### Get alerts
GET http://localhost:5000/api/alerts

### Get statistics
GET http://localhost:5000/api/statistics

### Create new home
POST http://localhost:5000/api/homes
Content-Type: application/json

{
  "homeId": "H011",
  "address": "New Street 99",
  "owner": "New Owner"
}
```

Install "REST Client" extension and click "Send Request" above each endpoint.

## Troubleshooting in VS Code

### Ports Already in Use

In VS Code terminal:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Rebuild Everything

```bash
# Full restart
docker-compose down -v
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### Clear Docker Resources

```bash
# Remove unused images/containers
docker system prune -a

# Check available space
docker system df
```

## IDE Extensions Recommendation

For optimal development experience, install:

1. **Docker** - Container management
2. **MongoDB for VS Code** - Database exploration
3. **REST Client** - API testing
4. **Thunder Client** - API testing alternative
5. **Prettier** - Code formatting
6. **ESLint** - Code linting

## Next Steps

1. ✅ Services running
2. ✅ Dashboard accessible at http://localhost:3000
3. ✅ API responding at http://localhost:5000
4. ✅ Data being generated

Now explore:
- [ ] View homes and consumption data
- [ ] Check real-time consumption updates
- [ ] Review alerts in MongoDB
- [ ] Examine generator logs
- [ ] Modify alert thresholds
- [ ] Create additional homes

## Support

For detailed information:
- See **README.md** for architecture and features
- See **docker-compose.yml** for service configuration
- See **backend/server.js** for API implementation
- See **frontend/pages/** for UI pages

Happy monitoring! 🚀
