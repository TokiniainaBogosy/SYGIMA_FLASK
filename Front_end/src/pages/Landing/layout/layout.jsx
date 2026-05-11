import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './footer'

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}