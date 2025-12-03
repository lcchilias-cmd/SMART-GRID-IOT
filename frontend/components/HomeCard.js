export default function HomeCard({ home, data }) {
  const power = data?.power ?? 0;
  const getStatusColor = (power) => {
    if (power > 1200) return '#dc2626';
    if (power < 250) return '#3b82f6';
    return '#10b981';
  };

  return (
    <div className="home-card">
      <div className="card-header">
        <h3>{home.homeId}</h3>
        <span className="address">{home.address}</span>
      </div>
      <div className="card-body">
        <div className="power-display">
          <div
            className="power-indicator"
            style={{ backgroundColor: getStatusColor(power) }}
          />
          <div className="power-info">
            <span className="power-value">{power.toFixed(2)}W</span>
            <span className="power-label">Current Usage</span>
          </div>
        </div>
        <p className="owner">Owner: {home.owner}</p>
      </div>
    </div>
  );
}
