const statusConfig = {
  SOUMISE:    { label: 'Soumise',    classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  APPROUVEE:  { label: 'Approuvée',  classes: 'bg-green-50 text-green-700 ring-green-600/20' },
  REJETEE:    { label: 'Rejetée',    classes: 'bg-red-50 text-red-700 ring-red-600/20' },
  LIVREE:     { label: 'Livrée',     classes: 'bg-gray-50 text-gray-700 ring-gray-500/20' },
  EN_COURS:   { label: 'En cours',   classes: 'bg-orange-50 text-orange-700 ring-orange-600/20' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-50 text-gray-700 ring-gray-500/20' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.classes.split(' ')[1].replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  );
}