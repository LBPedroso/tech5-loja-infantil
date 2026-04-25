import React, { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import { Transacao } from '../../types'
import AlertMessage from '../ui/AlertMessage'
import Pagination from '../ui/Pagination'

interface TransacaoListProps {
  onNovo: () => void
  recarregar: number
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const formatDate = (v: string) => new Date(v).toLocaleDateString('pt-BR')

const TransacaoList: React.FC<TransacaoListProps> = ({ onNovo, recarregar }) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [filtroTipo, setFiltroTipo] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTransacoes = useCallback(async (pageNum: number, tipo: string) => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, unknown> = { page: pageNum, limit: 10 }
      if (tipo) params.tipo = tipo
      const res = await api.get('/financeiro', { params })
      const payload = res.data?.data
      const data: Transacao[] = Array.isArray(payload?.data) ? payload.data : []
      setTransacoes(data)
      setPage(payload?.page || pageNum)
      setTotalPages(payload?.pages || 1)
    } catch {
      setError('Erro ao carregar transações')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTransacoes(page, filtroTipo) }, [page, filtroTipo, recarregar, loadTransacoes])

  const handleExcluir = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.delete(`/financeiro/${id}`)
      setSuccess('Transação excluída')
      loadTransacoes(page, filtroTipo)
    } catch {
      setError('Erro ao excluir transação')
    }
  }

  const handleFiltro = (tipo: string) => {
    setFiltroTipo(tipo)
    setPage(1)
  }

  return (
    <div>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" onClick={onNovo}>+ Nova Transação</button>
        <select value={filtroTipo} onChange={(e) => handleFiltro(e.target.value)} style={{ marginBottom: 0 }}>
          <option value="">Todos os tipos</option>
          <option value="ENTRADA">Entradas</option>
          <option value="SAIDA">Saídas</option>
        </select>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : transacoes.length === 0 ? (
        <p>Nenhuma transação registrada.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id}>
                <td>
                  <span style={{
                    color: t.tipo === 'ENTRADA' ? '#16a34a' : '#dc2626',
                    fontWeight: 600,
                  }}>
                    {t.tipo === 'ENTRADA' ? '▲ ENTRADA' : '▼ SAÍDA'}
                  </span>
                </td>
                <td style={{ color: t.tipo === 'ENTRADA' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {formatCurrency(t.valor)}
                </td>
                <td>{t.descricao || '-'}</td>
                <td>{formatDate(t.data)}</td>
                <td>
                  <button type="button" onClick={() => handleExcluir(t.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  )
}

export default TransacaoList
