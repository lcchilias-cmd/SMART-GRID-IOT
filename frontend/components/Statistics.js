export default function Statistics({ stats }) {
  return (
    <div className="statistics">
      <div className="stat-card">
        <h4>Total Consumption</h4>
        <p className="stat-number">{stats.totalConsumption.toFixed(2)}</p>
        <span>Wh (24h)</span>
      </div>
      <div className="stat-card">
        <h4>Average per Home</h4>
        <p className="stat-number">{stats.averageByHome.toFixed(2)}</p>
        <span>W</span>
      </div>
      <div className="stat-card">
        <h4>Highest Consumer</h4>
        <p className="stat-number">{stats.highestConsumer.homeId}</p>
        <span>{stats.highestConsumer.consumption.toFixed(2)}W</span>
      </div>
    </div>
  );
}
