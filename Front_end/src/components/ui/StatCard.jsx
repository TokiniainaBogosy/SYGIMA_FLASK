import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ label, value, trend, trendValue, icon: Icon, color }) {
  const colorClasses = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   bar: 'bg-blue-500' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', bar: 'bg-orange-500' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  bar: 'bg-green-500' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    bar: 'bg-red-500' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', bar: 'bg-purple-500' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', bar: 'bg-indigo-500' },
  };

  const c = colorClasses[color] || colorClasses.blue;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
      {/* Barre supérieure colorée */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${c.bar}`} />
      
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className={`${c.bg} p-2.5 rounded-lg`}>
            <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={2} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trendColor} bg-gray-50 px-2 py-1 rounded-full`}>
              <TrendIcon className="w-3 h-3" />
              {trendValue}
            </div>
          )}
        </div>
        
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}