import { useMemo } from 'react'
import { CheckCircle2, Clock3, Mail, ShieldCheck, Users, UserX } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import StatCard from '../../components/ui/StatCard'

const roleLabels = {
  ADMIN: 'Administrateurs',
  RESPONSABLE: 'Responsables',
  MAGASINIER: 'Magasiniers',
  EMPLOYE: 'Employés',
}

const formatDate = (date) => {
  if (!date) return 'Date inconnue'
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'Date inconnue'
    : parsedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const AdminDashboard = () => {
  const { data: users, loading, error } = useApi('/user/')
  const utilisateurs = Array.isArray(users) ? users : []

  const stats = useMemo(() => {
    const activeUsers = utilisateurs.filter((user) => user.is_active === true || user.is_active === 1 || user.is_active === '1').length
    const inactiveUsers = utilisateurs.length - activeUsers
    const roles = utilisateurs.reduce((result, user) => {
      const role = user.role || 'AUTRE'
      result[role] = (result[role] || 0) + 1
      return result
    }, {})
    const departments = utilisateurs.reduce((result, user) => {
      const department = user.departement || 'Sans département'
      result[department] = (result[department] || 0) + 1
      return result
    }, {})

    return {
      activeUsers,
      inactiveUsers,
      roles: Object.entries(roles).sort(([, first], [, second]) => second - first),
      departments: Object.entries(departments).sort(([, first], [, second]) => second - first).slice(0, 5),
    }
  }, [utilisateurs])

  const recentUsers = [...utilisateurs]
    .sort((first, second) => new Date(second.created_at || 0) - new Date(first.created_at || 0))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full px-6 py-8 space-y-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Gestion des utilisateurs</h1>
            <p className="mt-1 text-gray-500">Voici un aperçu des comptes et des accès de votre entreprise</p>
          </div>
        </header>

        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Impossible de charger les utilisateurs pour le moment.</div>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Utilisateurs total', value: utilisateurs.length, icon: Users, color: 'navy' },
            { label: 'Comptes actifs', value: stats.activeUsers, icon: CheckCircle2, color: 'teal' },
            { label: 'Comptes inactifs', value: stats.inactiveUsers, icon: UserX, color: 'red' },
            { label: 'Rôles utilisés', value: stats.roles.length, icon: ShieldCheck, color: 'orange' },
          ].map(({ label, value, detail, icon: Icon, color }) => (
            <StatCard key={label} label={label} value={loading ? '—' : value} trendValue={detail} icon={Icon} color={color} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-4">
              <div className="px-6 py-4"><h2 className="text-lg font-semibold text-gray-900">Répartition par rôle</h2><p className="mt-0.5 text-sm text-gray-500">Les profils présents dans votre organisation</p></div>
              <ShieldCheck className="mr-6 h-5 w-5 text-[#8B939A]" />
            </div>
            <div className="space-y-5 border-t border-gray-200 p-6">
              {stats.roles.length === 0 && <p className="text-sm text-gray-400">Aucun rôle à afficher.</p>}
              {stats.roles.map(([role, count]) => (
                <div key={role}>
                  <div className="mb-2 flex justify-between text-sm"><span className="font-medium text-gray-700">{roleLabels[role] || role}</span><span className="font-bold text-[#8B939A]">{count}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#58B2B0]" style={{ width: `${(count / utilisateurs.length) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4"><div><h2 className="text-lg font-semibold text-gray-900">Par département</h2><p className="mt-0.5 text-sm text-gray-500">Effectif par équipe</p></div><Users className="h-5 w-5 text-[#8B939A]" /></div>
            <div className="divide-y divide-gray-100 px-6">
              {stats.departments.length === 0 && <p className="py-4 text-sm text-gray-400">Aucun département à afficher.</p>}
              {stats.departments.map(([department, count]) => <div key={department} className="flex items-center justify-between py-3 text-sm"><span className="truncate pr-4 text-gray-700">{department}</span><span className="rounded-full bg-[#E7F4F3] px-2.5 py-1 font-bold text-[#58B2B0]">{count}</span></div>)}
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6"><h2 className="text-lg font-semibold text-gray-900">Derniers utilisateurs inscrits</h2><p className="mt-0.5 text-sm text-gray-500">Les comptes les plus récemment créés</p></div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length === 0 && <div className="p-6 text-sm text-gray-400">Aucun utilisateur à afficher.</div>}
            {recentUsers.map((user) => <div key={user.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F4F3] font-bold text-[#58B2B0]">{`${user.prenom || ''}${user.nom || ''}`.trim().slice(0, 2).toUpperCase() || '?'}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{user.prenom} {user.nom}</p><p className="flex items-center gap-1 truncate text-xs text-gray-400"><Mail className="h-3 w-3" />{user.email}</p></div></div><div className="flex items-center gap-4 pl-13 text-xs sm:pl-0"><span className="rounded-full bg-[#E8EDF1] px-3 py-1 font-semibold text-[#0D3056]">{roleLabels[user.role] || user.role || 'Sans rôle'}</span><span className="flex items-center gap-1 text-gray-400"><Clock3 className="h-3.5 w-3.5" />{formatDate(user.created_at)}</span></div></div>)}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard