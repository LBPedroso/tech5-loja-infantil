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

  const summaryCards = [
    { title: 'Modulos ativos', value: '5', tone: 'teal' },
    { title: 'Status do sistema', value: 'Online', tone: 'green' },
    { title: 'Perfil logado', value: user?.nome || '-', tone: 'blue' },
    { title: 'Ambiente', value: 'Producao', tone: 'purple' },
  ]

  const currentTabLabel = TABS.find((tab) => tab.key === activeTab)?.label || 'Painel'

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <h2 className="brand-title sidebar-title">Lili&amp;Gu</h2>
          <p className="sidebar-subtitle">Painel administrativo</p>
        </div>

        <nav className="sidebar-menu" aria-label="Navegacao principal">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`menu-button${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Bem-vindo, {user?.nome}</p>
          <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="topbar">
          <h1 className="page-title">Resumo da loja</h1>
          <p className="page-subtitle">Visao geral e operacao do modulo: {currentTabLabel}</p>
        </header>

        <section className="summary-grid">
          {summaryCards.map((card) => (
            <article key={card.title} className="summary-card">
              <p className="summary-label">{card.title}</p>
              <p className={`summary-value ${card.tone}`}>{card.value}</p>
            </article>
          ))}
        </section>

        <div className="card workspace-card">
          {activeTab === 'dashboard' && <HomeSection />}
          {activeTab === 'categorias' && <CategoriasSection />}
          {activeTab === 'produtos' && <ProdutosSection />}
          {activeTab === 'pedidos' && <PedidosSection />}
          {activeTab === 'perfil' && <PerfilForm />}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
