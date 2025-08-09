import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer,  Legend } from 'recharts';

export default function PieChartComponent({ data, width = 500, height = 300, innerRadius = 40, outerRadius = 100 }) {
  return (
    <div className="flex items-center gap-36">
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="bottom" align="start"/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
