import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ConsumptionChart({ data }) {
  const chartData = data.map(record => ({
    time: new Date(record.timestamp).toLocaleTimeString(),
    power: record.power,
    timestamp: record.timestamp,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis label={{ value: 'Power (W)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value) => [`${value.toFixed(2)}W`, 'Power']}
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#3b82f6"
            dot={false}
            isAnimationActive={false}
            name="Power Consumption"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
