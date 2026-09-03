import { useMemo } from 'react';

// Graphique simple en SVG pur (pas de lib externe)
export default function ActivityChart({ data, height = 200 }) {
  // Données mock pour l'exemple — remplace par tes vraies données
  const defaultData = [
    { label: 'Lun', value: 12 },
    { label: 'Mar', value: 19 },
    { label: 'Mer', value: 8 },
    { label: 'Jeu', value: 25 },
    { label: 'Ven', value: 15 },
    { label: 'Sam', value: 5 },
    { label: 'Dim', value: 3 },
  ];

  const chartData = data || defaultData;
  const maxValue = Math.max(...chartData.map(d => d.value));
  const padding = 20;
  const chartHeight = height - padding * 2;
  const barWidth = 32;
  const gap = 16;
  
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${chartData.length * (barWidth + gap) + gap} ${height}`} className="w-full" preserveAspectRatio="none">
        {chartData.map((item, i) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = gap + i * (barWidth + gap);
          const y = height - padding - barHeight;
          
          return (
            <g key={i}>
              {/* Barre */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                className="fill-[#58B2B0] hover:fill-[#1e4e7e] transition-colors"
              />
              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height - 5}
                textAnchor="middle"
                className="fill-gray-400 text-xs"
              >
                {item.label}
              </text>
              {/* Valeur au-dessus */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                className="fill-gray-600 text-xs font-medium"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}