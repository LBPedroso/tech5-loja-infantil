import React, { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import { FinanceiroResumo } from '../../types'
import TransacaoList from './TransacaoList'
import TransacaoForm from './TransacaoForm'

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const FinanceiroSection: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [resumo, setResumo] = useState<FinanceiroResumo | null>(null)
  const [recarregar, setRecarregar] = useState(0)

  const loadResumo = useCallback(async () => {
    try {
      const res = await api.get('/financeiro/resumo')
      setResumo(res.data?.data ?? null)
    } catch {
      // silencioso — lista ainda aparece
    }
  }, [])

  useEffect(() => { loadResumo() }, [recarregar, loadResumo])

  const handleSalvo = () => {
    setView('list')
    setRecarregar((n) => n + 1)
  }

  return (
    <div>
      {/* Cards de resumo */}
      <div className="summary-grid" style={{ marginBottom: '24px' }}>
        <div className="summary-card" style={{ borderTop: '4px solid #16a34a' }}>
          <div className="summary-label">Entradas (total)</div>
          <div className="summary-value" style={{ color: '#16a34a' }}>
            {resumo ? formatCurrency(resumo.totalEntradas) : '...'}
          </div>
        </div>
        <div className="summary-card" style={{ borderTop: '4px solid #dc2626' }}>
          <div className="summary-label">Saídas (total)</div>
          <div className="summary-value" style={{ color: '#dc2626' }}>
            {resumo ? formatCurrency(resumo.totalSaidas) : '...'}
          </div>
        </div>
        <div className="summary-card" style={{ borderTop: '4px solid #7c3aed' }}>
          <div className="summary-label">Saldo Geral</div>
          <div className="summary-value" style={{ color: resumo && resumo.saldo >= 0 ? '#16a34a' : '#dc2626' }}>
            {resumo ? formatCurrency(resumo.saldo) : '...'}
          </div>
        </div>
        <div className="summary-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div className="summary-label">Saldo do Mês</div>
          <div className="summary-value" style={{ color: resumo && resumo.mesAtual.saldo >= 0 ? '#16a34a' : '#dc2626' }}>
            {resumo ? formatCurrency(resumo.mesAtual.saldo) : '...'}
          </div>
        </div>
      </div>

      {/* Detalhes do mês */}
      {resumo && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>
            ▲ Entradas do mês: {formatCurrency(resumo.mesAtual.entradas)}
          </span>
          <span style={{ color: '#dc2626', fontWeight: 600 }}>
            ▼ Saídas do mês: {formatCurrency(resumo.mesAtual.saidas)}
          </span>
        </div>
      )}

      {/* Conteúdo principal */}
      {view === 'form' ? (
        <TransacaoForm onSalvo={handleSalvo} onCancelar={() => setView('list')} />
      ) : (
        <TransacaoList onNovo={() => setView('form')} recarregar={recarregar} />
      )}
    </div>
  )
}

export default FinanceiroSection
