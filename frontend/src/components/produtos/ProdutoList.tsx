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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProdutos = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/produtos', { params: { page: pageNum, limit: 10 } })
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

  useEffect(() => { loadProdutos(page) }, [page, loadProdutos])

  const handleExcluir = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.delete(`/produtos/${id}`)
      setSuccess('Produto excluído com sucesso')
      loadProdutos(page)
    } catch {
      setError('Erro ao excluir produto')
    }
  }

  return (
    <div>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <button type="button" onClick={onNovo} style={{ marginBottom: '16px' }}>
        + Novo Produto
      </button>
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
