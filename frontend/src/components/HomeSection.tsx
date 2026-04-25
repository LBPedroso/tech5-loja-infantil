import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const HomeSection: React.FC = () => {
  const { user } = useAuth()

  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>Painel da Lili&amp;Gu</h2>
      <p style={{ color: '#5f5a66' }}>Bem-vindo ao sistema de gestao da Lili&amp;Gu Moda Infantil.</p>

      <div className="home-grid">
        <article className="home-stat">
          <p className="home-stat-label">Nome</p>
          <p className="home-stat-value">{user?.nome || '-'}</p>
        </article>

        <article className="home-stat">
          <p className="home-stat-label">Email</p>
          <p className="home-stat-value">{user?.email || '-'}</p>
        </article>

        <article className="home-stat">
          <p className="home-stat-label">CPF</p>
          <p className="home-stat-value">{user?.cpf || '-'}</p>
        </article>
      </div>
    </div>
  )
}

export default HomeSection
