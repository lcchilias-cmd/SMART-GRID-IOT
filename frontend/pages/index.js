import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import HomeCard from '../components/HomeCard';
import Statistics from '../components/Statistics';

export default function Home({ socket }) {
  const [homes, setHomes] = useState([]);
  const [stats, setStats] = useState(null);
  const [consumptionData, setConsumptionData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomes();
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on('consumption_update', (data) => {
      setConsumptionData(prev => ({
        ...prev,
        [data.homeId]: data,
      }));
    });

    return () => socket.off('consumption_update');
  }, [socket]);

  const fetchHomes = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/homes`);
      setHomes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching homes:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <header className="header">
        <h1>⚡ Smart Grid Energy Monitoring</h1>
        <p>Real-time IoT Energy Consumption Dashboard</p>
      </header>

      {stats && <Statistics stats={stats} />}

      <div className="homes-grid">
        {homes.map(home => (
          <Link key={home._id} href={`/home/${home.homeId}`}>
            <a>
              <HomeCard
                home={home}
                data={consumptionData[home.homeId]}
              />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
