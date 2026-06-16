import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/auth/login'
import Register from './components/auth/register'
import DashBoard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import MaterielForm from './components/Formulaire/MaterielForm'
import Accueil from './pages/User/Accueil';
import AdminDashboard from './pages/Admin/AdminDashboardToki';
import SoumettreDemande from './pages/User/SoumettreDemande'
import './index.css'
import { useEffect, useState } from 'react';
import TraitementDemande from './pages/Fournisseur/TraitementDemande';
import ListDepartement from './pages/Admin/ListDepartement';
import CategorieMateriel from './pages/Fournisseur/CategorieMateriel';
import Dashboard from './pages/Dashboard'
import Navbar from './components/Header/Navbar';
import Layout from './components/layout/Layout'
import Stock from './pages/Admin/Stock'
import Demandes from './pages/Admin/Demandes'
import Utilisateur from './pages/User/Utilisateur'
import DepartementForm from './components/Formulaire/DepartementForm'
import CategorieForm from './components/Formulaire/CategorieForm'
import Materiel from './pages/Admin/Materiel'
import HomePage from './pages/Landing/Home_page2'
import LandingLayout from './pages/Landing/layout/layout'
import Features from './pages/Landing/features'
import Pricing from './pages/Landing/Pricing'
import RegisterParDepartement from './components/auth/registerParDepartement'
import MaterielAdmin from './pages/Admin/MaterielAdmin'
import StockAdmin from './pages/Admin/StockAdmin'
import DepartementList from './components/Affichage/GestionDepartement'
import DetailDemandes from './components/Affichage/DetailDemandes'
import GestionUser from './pages/Admin/GestionUser'


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className='bg-gray-50'>
      
      {/* <Navbar/> */}
      <AuthProvider>
        

        {/* {isLoggedIn && <Header />} */}

        <Routes>
          {/* PUBLIC */}
          <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <DashBoard />
                </Layout>
              </ProtectedRoute> 
            } 
          />
          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <Layout>  
                  <Stock />
                </Layout> 
              </ProtectedRoute>
            }
          />
          <Route
            path="/departements"
            element={
              <ProtectedRoute>
                <Layout>
                  <DepartementList/>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                
                  <Register />
                
              </ProtectedRoute>
            }
          />
          <Route
            path="/registerParDepartement"
            element={
              <ProtectedRoute>
                
                  <RegisterParDepartement/>
  
              </ProtectedRoute>
            }
          />

          <Route
            path="/demandes"
            element={
              <ProtectedRoute>
                <Layout>
                  <Demandes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/demandes"
            element={
              <ProtectedRoute>
                <Layout>
                  <Demandes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/utilisateur"
            element={
              <ProtectedRoute>
                <Layout>
                  <Utilisateur />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/materiels"
            element={
              <ProtectedRoute>
                <Layout>
                  <Materiel/>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/materielAdmin" 
            element={
              <ProtectedRoute>
                <Layout>
                  <MaterielAdmin/>
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/StockAdmin" 
            element={
              <ProtectedRoute>
                <Layout>
                  <StockAdmin/>
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route
            path="/GestionUser"
            element={
              <ProtectedRoute>
                <Layout>
                  <GestionUser/>
                </Layout>
              </ProtectedRoute>
            }
          />  
          <Route path="/SoumettreDemande" element={<SoumettreDemande />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/TraitementDemande" element={<TraitementDemande />} />
          <Route path="/ListDepartement" element={<ListDepartement />} />
          <Route path="/CategorieMateriel" element={<CategorieMateriel />} />
          
          {/* REDIRECTION */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/SoumettreDemande" element={<SoumettreDemande/>} />
          <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          <Route path="/TraitementDemande" element={<TraitementDemande/>}/>
          <Route path="/ListDepartement" element={<ListDepartement/>}/>
          <Route path="/" element={<Login/>}/>
          <Route path="/CategorieMateriel" element={<CategorieMateriel/>}/>
          <Route path="/DetailDemande" element={<DetailDemandes/>}/>
        </Routes>
      </AuthProvider>
    </div>
  )
}



   
