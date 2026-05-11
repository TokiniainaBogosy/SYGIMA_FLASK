import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DataTable({ 
  data, 
  columns, 
  title, 
  subtitle,
  loading, 
  error,
  emptyMessage = "Aucune donnée disponible",
  maxRows = 5 
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-16 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">Erreur de chargement</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {data.length > 0 && (
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {data.length} au total
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {columns.map((col, i) => (
                    <th 
                      key={i} 
                      className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.slice(0, maxRows).map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors">
                    {columns.map((col, j) => (
                      <td key={j} className={`px-6 py-4 ${col.className || 'text-sm text-gray-900'}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination simplifiée */}
          {data.length > maxRows && (
            <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Affichage de 1-{maxRows} sur {data.length}
              </p>
              <div className="flex gap-2">
                <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}