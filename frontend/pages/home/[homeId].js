import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import PowerMeter from '../../components/PowerMeter';
import ConsumptionChart from '../../components/ConsumptionChart';
import AlertsList from '../../components/AlertsList';

export default function HomeDetail({ socket }) {
  const router = useRouter();
  const { homeId } = router.query;
  const [home, setHome] = useState(null);
  const [currentPower, setCurrentPower] = useState(0);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ peak: 0, avg: 0 });

  useEffect(() => {
    if (!homeId) return;
    fetchHome();
    fetchHistory();
    fetchAlerts();
  }, [homeId]);

  useEffect(() => {
    if (!homeId) return;
    const interval = setInterval(() => {
      fetchHistory();
    }, 10000);
    return () => clearInterval(interval);
  }, [homeId]);

  useEffect(() => {
    if (!socket || !homeId) return;
    socket.on('consumption_update', (data) => {
      if (data.homeId === homeId) {
        setCurrentPower(data.power);
      }
    });

    return () => socket.off('consumption_update');
  }, [socket, homeId]);

  const fetchHome = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/homes`);
      const home = response.data.find(h => h.homeId === homeId);
      setHome(home);
    } catch (error) {
      console.error('Error fetching home:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/consumption/${homeId}/history`
      );
      setHistory(response.data);
      
      if (response.data.length > 0) {
        const powers = response.data.map(r => r.power);
        setStats({
          peak: Math.max(...powers),
          avg: powers.reduce((a, b) => a + b, 0) / powers.length,
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts`);
      setAlerts(response.data.filter(a => a.homeId === homeId));
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  if (!home) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <header className="header">
        <Link href="/">
          <a className="back-link">← Back to Homes</a>
        </Link>
        <h1>{home.address}</h1>
        <p>Owner: {home.owner}</p>
      </header>

      <div className="home-grid">
        <div className="meter-section">
          <PowerMeter power={currentPower} />
        </div>

        <div className="stats-section">
          <div className="stat-box">
            <h3>Peak Usage</h3>
            <p className="stat-value">{stats.peak.toFixed(2)}W</p>
          </div>
          <div className="stat-box">
            <h3>Average Usage</h3>
            <p className="stat-value">{stats.avg.toFixed(2)}W</p>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2>24-Hour Consumption History</h2>
        <ConsumptionChart data={history} />
      </div>

      <div className="alerts-section">
        <h2>Recent Alerts</h2>
        <AlertsList alerts={alerts} />
      </div>
    </div>
  );
}
