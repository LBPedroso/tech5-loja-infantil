import React, { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import { Pedido } from '../../types'
import AlertMessage from '../ui/AlertMessage'
import Pagination from '../ui/Pagination'

interface PedidoListProps {
  onNovo: () => void
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const formatDate = (v: string) => new Date(v).toLocaleString('pt-BR')

const PedidoList: React.FC<PedidoListProps> = ({ onNovo }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [statusEdit, setStatusEdit] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadPedidos = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/pedidos', { params: { page: pageNum, limit: 10 } })
      const payload = res.data?.data
      const data: Pedido[] = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
      setPedidos(data)
      setPage(payload?.page || pageNum)
      setTotalPages(payload?.pages || 1)
      setStatusEdit(data.reduce((acc: Record<string, string>, p) => { acc[p.id] = p.status; return acc }, {}))
    } catch {
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPedidos(page) }, [page, loadPedidos])

  const handleAtualizarStatus = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.put(`/pedidos/${id}/status`, { status: statusEdit[id] || 'PENDENTE' })
      setSuccess('Status atualizado com sucesso')
      loadPedidos(page)
    } catch {
      setError('Erro ao atualizar status')
    }
  }

  const handleExcluir = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.delete(`/pedidos/${id}`)
      setSuccess('Pedido excluído com sucesso')
      loadPedidos(page)
    } catch {
      setError('Erro ao excluir pedido')
    }
  }

  return (
    <div>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <button type="button" onClick={onNovo} style={{ marginBottom: '16px' }}>
        + Novo Pedido
      </button>
      {loading ? (
        <p>Carregando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>Nenhum pedido cadastrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Itens</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id.slice(0, 8)}...</td>
                <td>{formatCurrency(pedido.total)}</td>
                <td>
                  <select
                    value={statusEdit[pedido.id] || pedido.status}
                    onChange={(e) => setStatusEdit((prev) => ({ ...prev, [pedido.id]: e.target.value }))}
                  >
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="PROCESSANDO">PROCESSANDO</option>
                    <option value="ENTREGUE">ENTREGUE</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </td>
                <td>{formatDate(pedido.createdAt)}</td>
                <td>{pedido.itens.map((item) => `${item.produto.nome} x${item.quantidade}`).join(', ')}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => handleAtualizarStatus(pedido.id)}>Salvar status</button>
                  <button type="button" onClick={() => handleExcluir(pedido.id)}>Excluir</button>
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

export default PedidoList
