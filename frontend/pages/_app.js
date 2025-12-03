import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/globals.css';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

function MyApp({ Component, pageProps }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on('alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 5));
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.timestamp !== alert.timestamp));
      }, 5000);
    });

    return () => socket.off('alert');
  }, []);

  return (
    <div className="app">
      <Component {...pageProps} socket={socket} />
      <div className="alerts-container">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`alert alert-${alert.level.toLowerCase()}`}
          >
            <strong>{alert.homeId}</strong>: {alert.value.toFixed(2)}W - {alert.level}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApp;
