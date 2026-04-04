import React, { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import { Categoria } from '../../types'
import AlertMessage from '../ui/AlertMessage'
import Pagination from '../ui/Pagination'

interface CategoriaListProps {
  onNovo: () => void
  onEditar: (categoria: Categoria) => void
}

const CategoriaList: React.FC<CategoriaListProps> = ({ onNovo, onEditar }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadCategorias = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/categorias', { params: { page: pageNum, limit: 10 } })
      const payload = res.data?.data
      const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
      setCategorias(data)
      setPage(payload?.page || pageNum)
      setTotalPages(payload?.pages || 1)
    } catch {
      setError('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCategorias(page) }, [page, loadCategorias])

  const handleExcluir = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.delete(`/categorias/${id}`)
      setSuccess('Categoria excluída com sucesso')
      loadCategorias(page)
    } catch {
      setError('Erro ao excluir categoria')
    }
  }

  return (
    <div>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <button type="button" onClick={onNovo} style={{ marginBottom: '16px' }}>
        + Nova Categoria
      </button>
      {loading ? (
        <p>Carregando categorias...</p>
      ) : categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.nome}</td>
                <td>{cat.descricao || '-'}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => onEditar(cat)}>Editar</button>
                  <button type="button" onClick={() => handleExcluir(cat.id)}>Excluir</button>
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

export default CategoriaList
