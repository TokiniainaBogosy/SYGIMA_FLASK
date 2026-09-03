import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Palette Sygima : navy (principal), teal (positif/validé), orange (attention),
// red conservé pour les alertes critiques (convention d'accessibilité danger).
export default function StatCard({ label, value, trend, trendValue, icon: Icon, color }) {
  const colorClasses = {
    navy:   { bg: 'bg-[#E8EDF1]', icon: 'text-[#0D3056]', bar: 'bg-[#0D3056]' },
    teal:   { bg: 'bg-[#E7F4F3]', icon: 'text-[#58B2B0]', bar: 'bg-[#58B2B0]' },
    orange: { bg: 'bg-[#FCF1E1]', icon: 'text-[#E5A03A]', bar: 'bg-[#E5A03A]' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',   bar: 'bg-red-500' },
  };

  const c = colorClasses[color] || colorClasses.navy;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-[#58B2B0]' : trend === 'down' ? 'text-red-600' : 'text-[#8B939A]';

  return (
    <div className="relative bg-white rounded-xl border border-[#F2F3F4] p-5 hover:shadow-lg hover:border-[#E3E6E8] transition-all duration-200 group">
      {/* Barre supérieure colorée */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${c.bar}`} />
      
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className={`${c.bg} p-2.5 rounded-lg`}>
            <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={2} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trendColor} bg-[#F2F3F4] px-2 py-1 rounded-full`}>
              <TrendIcon className="w-3 h-3" />
              {trendValue}
            </div>
          )}
        </div>
        
        <p className="text-sm font-medium text-[#8B939A]">{label}</p>
        <p className="text-2xl font-bold text-[#0D3056] mt-1 font-['Montserrat',_sans-serif]">{value}</p>
      </div>
    </div>
  );
}
