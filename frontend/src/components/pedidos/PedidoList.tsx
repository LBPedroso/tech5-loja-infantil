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

const formatDate = (v?: string) => {
  if (!v) return '-'
  const parsed = new Date(v)
  return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleString('pt-BR')
}

const getPedidoItens = (pedido: Pedido & { items?: unknown[]; itens?: unknown[] }) => {
  if (Array.isArray(pedido.itens)) return pedido.itens
  if (Array.isArray(pedido.items)) return pedido.items
  return []
}

const getItemDescricao = (item: unknown): string => {
  const raw = item as {
    quantidade?: number
    produto?: { nome?: string }
    nome?: string
    produtoNome?: string
  }

  const nome = raw.produto?.nome || raw.produtoNome || raw.nome || 'Produto'
  const quantidade = Number(raw.quantidade ?? 0)
  return `${nome} x${Number.isFinite(quantidade) ? quantidade : 0}`
}

const getPedidoTotal = (pedido: Pedido & { items?: unknown[]; itens?: unknown[] }): number => {
  const total = Number((pedido as { total?: number }).total)
  if (Number.isFinite(total)) return total

  const itens = getPedidoItens(pedido)
  return itens.reduce((acc: number, item) => {
    const raw = item as { preco?: number; quantidade?: number }
    const preco = Number(raw.preco ?? 0)
    const quantidade = Number(raw.quantidade ?? 0)
    return acc + (Number.isFinite(preco) ? preco : 0) * (Number.isFinite(quantidade) ? quantidade : 0)
  }, 0)
}

const PedidoList: React.FC<PedidoListProps> = ({ onNovo }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [statusEdit, setStatusEdit] = useState<Record<string, string>>({})
  const [filtroStatus, setFiltroStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadPedidos = useCallback(async (pageNum: number, status: string) => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, unknown> = { page: pageNum, limit: 10 }
      if (status) params.status = status
      const res = await api.get('/pedidos', { params })
      const rootPayload = res.data
      const payload = rootPayload?.data
      const data: Pedido[] = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : Array.isArray(rootPayload)
            ? rootPayload
            : []
      setPedidos(data)
      setPage(payload?.page || rootPayload?.page || pageNum)
      setTotalPages(payload?.pages || rootPayload?.pages || 1)
      setStatusEdit(data.reduce((acc: Record<string, string>, p) => {
        acc[String((p as { id?: string | number }).id ?? '')] = p.status
        return acc
      }, {}))
    } catch {
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPedidos(page, filtroStatus) }, [page, filtroStatus, loadPedidos])

  const handleFiltro = (novoStatus: string) => {
    setFiltroStatus(novoStatus)
    setPage(1)
  }

  const handleAtualizarStatus = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.put(`/pedidos/${id}/status`, { status: statusEdit[id] || 'PENDENTE' })
      setSuccess('Status atualizado com sucesso')
      loadPedidos(page, filtroStatus)
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
      loadPedidos(page, filtroStatus)
    } catch {
      setError('Erro ao excluir pedido')
    }
  }

  return (
    <div>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" onClick={onNovo}>+ Novo Pedido</button>
        <select
          value={filtroStatus}
          onChange={(e) => handleFiltro(e.target.value)}
          style={{ marginBottom: 0 }}
        >
          <option value="">Todos os status</option>
          <option value="PENDENTE">PENDENTE</option>
          <option value="PROCESSANDO">PROCESSANDO</option>
          <option value="ENTREGUE">ENTREGUE</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </div>
      {loading ? (
        <p>Carregando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>Nenhum pedido cadastrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Itens</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={String((pedido as { id?: string | number }).id ?? '')}>
                <td>{String((pedido as { id?: string | number }).id ?? '').slice(0, 8)}...</td>
                <td>{pedido.cliente?.nome || 'Sem cliente'}</td>
                <td>{formatCurrency(getPedidoTotal(pedido as Pedido & { items?: unknown[]; itens?: unknown[] }))}</td>
                <td>
                  <select
                    value={statusEdit[String((pedido as { id?: string | number }).id ?? '')] || pedido.status}
                    onChange={(e) => setStatusEdit((prev) => ({
                      ...prev,
                      [String((pedido as { id?: string | number }).id ?? '')]: e.target.value,
                    }))}
                  >
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="PROCESSANDO">PROCESSANDO</option>
                    <option value="ENTREGUE">ENTREGUE</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </td>
                <td>{formatDate((pedido as { createdAt?: string }).createdAt)}</td>
                <td>{getPedidoItens(pedido as Pedido & { items?: unknown[]; itens?: unknown[] }).map(getItemDescricao).join(', ') || '-'}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => handleAtualizarStatus(String((pedido as { id?: string | number }).id ?? ''))}>Salvar status</button>
                  <button type="button" onClick={() => handleExcluir(String((pedido as { id?: string | number }).id ?? ''))}>Excluir</button>
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
