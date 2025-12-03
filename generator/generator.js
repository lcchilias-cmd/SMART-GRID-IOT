const mqtt = require('mqtt');
require('dotenv').config();

const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const HOMES_COUNT = 10;
const PUBLISH_INTERVAL = 5000;

const client = mqtt.connect(MQTT_BROKER);

const homes = Array.from({ length: HOMES_COUNT }, (_, i) => `H${String(i + 1).padStart(3, '0')}`);

client.on('connect', () => {
  console.log('✓ Connected to MQTT broker');
  console.log(`📡 Simulating ${HOMES_COUNT} homes\n`);
  
  setInterval(() => {
    homes.forEach(homeId => {
      const power = Math.random() * (1500 - 200) + 200;
      const topic = `home/${homeId}/consumption`;
      client.publish(topic, power.toFixed(2), (err) => {
        if (err) console.error(`Error publishing to ${topic}:`, err);
        else console.log(`📤 ${homeId}: ${power.toFixed(2)}W`);
      });
    });
  }, PUBLISH_INTERVAL);
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

console.log('🚀 Smart Grid IoT Data Generator started\n');
