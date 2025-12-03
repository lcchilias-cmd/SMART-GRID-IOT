export default function AlertsList({ alerts }) {
  if (alerts.length === 0) {
    return <div className="no-alerts">No alerts recorded for this home</div>;
  }

  return (
    <div className="alerts-list">
      {alerts.slice(0, 10).map((alert, idx) => (
        <div key={idx} className={`alert-item alert-${alert.type.toLowerCase()}`}>
          <div className="alert-icon">
            {alert.type === 'HIGH' ? '⚠️' : '❄️'}
          </div>
          <div className="alert-content">
            <h4>{alert.message}</h4>
            <p>{alert.value.toFixed(2)}W - {new Date(alert.timestamp).toLocaleString()}</p>
          </div>
          <span className={`alert-badge ${alert.type.toLowerCase()}`}>{alert.type}</span>
        </div>
      ))}
    </div>
  );
}
