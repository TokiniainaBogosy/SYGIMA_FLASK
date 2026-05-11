import { useAuth } from "../context/AuthContext"
// import  DashboardAdmin  from "../components/DashBoard/DashBoardAdmin"
import DashboardAdmin from "../components/DashBoard/DashBoardAdmin"
import  DashboardEmploye  from "../components/DashBoard/DashBoardEmploye"
import  DashboardMagasinier  from "../components/DashBoard/DashBoardMagasinier"
import  DashboardResponsable  from "../components/DashBoard/DashBoardResponsable"

export default function DashBoard(){

    const {user} = useAuth()
    return (
    <div>
      {user?.role === 'Admin' && <DashboardAdmin/>}
      {user?.role === 'Responsable' && <DashboardResponsable />}
      {user?.role === 'Magasinier' && <DashboardMagasinier />}
      {user?.role === 'Employe' && <DashboardEmploye />}
    </div>
  )
}