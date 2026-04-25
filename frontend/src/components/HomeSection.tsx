import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { FinanceiroResumo } from '../types'

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const HomeSection: React.FC = () => {
  const { user } = useAuth()
  const [resumo, setResumo] = useState<FinanceiroResumo | null>(null)

  useEffect(() => {
    const loadResumo = async () => {
      try {
        const res = await api.get('/financeiro/resumo')
        setResumo(res.data?.data ?? null)
      } catch {
        setResumo(null)
      }
    }

    loadResumo()
  }, [])

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

      <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Relatório Financeiro do Mês</h3>
      <div className="home-grid">
        <article className="home-stat">
          <p className="home-stat-label">Faturamento mensal</p>
          <p className="home-stat-value">{resumo ? formatCurrency(resumo.faturamentoMensal) : '-'}</p>
        </article>

        <article className="home-stat">
          <p className="home-stat-label">Lucro liquido mensal</p>
          <p className="home-stat-value">{resumo ? formatCurrency(resumo.lucroLiquidoMensal) : '-'}</p>
        </article>

        <article className="home-stat">
          <p className="home-stat-label">Custo produtos vendidos (mês)</p>
          <p className="home-stat-value">{resumo ? formatCurrency(resumo.custoProdutosMensal) : '-'}</p>
        </article>

        <article className="home-stat">
          <p className="home-stat-label">Ticket medio mensal</p>
          <p className="home-stat-value">{resumo ? formatCurrency(resumo.ticketMedioMensal) : '-'}</p>
        </article>

        <article className="home-stat">
          <p className="home-stat-label">Vendas entregues no mês</p>
          <p className="home-stat-value">{resumo ? resumo.totalVendasMensal : '-'}</p>
        </article>
      </div>
    </div>
  )
}

export default HomeSection
