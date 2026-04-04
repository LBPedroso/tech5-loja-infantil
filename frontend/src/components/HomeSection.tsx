import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const HomeSection: React.FC = () => {
  const { user } = useAuth()

  return (
    <div>
      <h2>Painel da Lili&amp;Gu</h2>
      <p>Bem-vindo ao sistema de gestão da Lili&amp;Gu Moda Infantil.</p>
      <ul style={{ marginTop: '12px' }}>
        <li><strong>Nome:</strong> {user?.nome}</li>
        <li><strong>Email:</strong> {user?.email}</li>
        <li><strong>CPF:</strong> {user?.cpf}</li>
      </ul>
    </div>
  )
}

export default HomeSection
