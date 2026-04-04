import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import HomeSection from '../components/HomeSection'
import CategoriasSection from '../components/categorias/CategoriasSection'
import ProdutosSection from '../components/produtos/ProdutosSection'
import PedidosSection from '../components/pedidos/PedidosSection'
import PerfilForm from '../components/perfil/PerfilForm'

type TabName = 'dashboard' | 'categorias' | 'produtos' | 'pedidos' | 'perfil'

const TABS: Array<{ key: TabName; label: string }> = [
  { key: 'dashboard', label: 'Home' },
  { key: 'categorias', label: 'Categorias' },
  { key: 'produtos', label: 'Produtos' },
  { key: 'pedidos', label: 'Pedidos' },
  { key: 'perfil', label: 'Meu Perfil' },
]

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabName>('dashboard')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <nav className="nav">
        <div><h2>Lili&amp;Gu Moda Infantil</h2></div>
        <div>
          <span>Bem-vindo, {user?.nome}</span>
          <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Sair</button>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'dashboard' && <HomeSection />}
          {activeTab === 'categorias' && <CategoriasSection />}
          {activeTab === 'produtos' && <ProdutosSection />}
          {activeTab === 'pedidos' && <PedidosSection />}
          {activeTab === 'perfil' && <PerfilForm />}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
