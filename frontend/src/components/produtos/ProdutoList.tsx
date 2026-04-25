import React, { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import { Produto } from '../../types'
import AlertMessage from '../ui/AlertMessage'
import Pagination from '../ui/Pagination'

interface ProdutoListProps {
  onNovo: () => void
  onEditar: (produto: Produto) => void
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const ProdutoList: React.FC<ProdutoListProps> = ({ onNovo, onEditar }) => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState('')
  const [buscaAtiva, setBuscaAtiva] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProdutos = useCallback(async (pageNum: number, termoBusca: string) => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, unknown> = { page: pageNum, limit: 10 }
      if (termoBusca) params.busca = termoBusca
      const res = await api.get('/produtos', { params })
      const payload = res.data?.data
      const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
      setProdutos(data)
      setPage(payload?.page || pageNum)
      setTotalPages(payload?.pages || 1)
    } catch {
      setError('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProdutos(page, buscaAtiva) }, [page, buscaAtiva, loadProdutos])

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setBuscaAtiva(busca.trim())
  }

  const handleLimpar = () => {
    setBusca('')
    setBuscaAtiva('')
    setPage(1)
  }

  const handleExcluir = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.delete(`/produtos/${id}`)
      setSuccess('Produto excluído com sucesso')
      loadProdutos(page, buscaAtiva)
    } catch {
      setError('Erro ao excluir produto')
    }
  }

  return (
    <div>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" onClick={onNovo}>+ Novo Produto</button>
        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button type="submit" style={{ whiteSpace: 'nowrap' }}>Buscar</button>
          {buscaAtiva && <button type="button" onClick={handleLimpar} style={{ whiteSpace: 'nowrap', background: '#aaa' }}>Limpar</button>}
        </form>
      </div>
      {loading ? (
        <p>Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Custo</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nome}</td>
                <td>{prod.categoria?.nome || '-'}</td>
                <td>{formatCurrency(prod.preco)}</td>
                <td>{formatCurrency(prod.custo)}</td>
                <td>{prod.quantidade}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => onEditar(prod)}>Editar</button>
                  <button type="button" onClick={() => handleExcluir(prod.id)}>Excluir</button>
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

export default ProdutoList
