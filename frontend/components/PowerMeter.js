export default function PowerMeter({ power }) {
  const maxPower = 1500;
  const percentage = (power / maxPower) * 100;
  
  const getColor = (power) => {
    if (power > 1200) return '#dc2626';
    if (power < 250) return '#3b82f6';
    return '#10b981';
  };

  return (
    <div className="power-meter">
      <h3>Live Power Meter</h3>
      <div className="meter-container">
        <div className="meter-circle">
          <svg viewBox="0 0 200 200" width="200" height="200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getColor(power)}
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 565} 565`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
            <text x="100" y="100" textAnchor="middle" fontSize="24" fontWeight="bold" fill={getColor(power)}>
              {power.toFixed(0)}W
            </text>
          </svg>
        </div>
      </div>
      <div className="meter-scale">
        <span>0W</span>
        <span>750W</span>
        <span>1500W</span>
      </div>
      <div className="meter-status">
        <span className={`status ${power > 1200 ? 'high' : power < 250 ? 'low' : 'normal'}`}>
          {power > 1200 ? '⚠️ HIGH' : power < 250 ? '❄️ LOW' : '✓ NORMAL'}
        </span>
      </div>
    </div>
  );
}
