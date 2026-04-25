import React, { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import { Cliente } from '../../types'
import AlertMessage from '../ui/AlertMessage'
import Pagination from '../ui/Pagination'

interface ClienteListProps {
  onNovo: () => void
  onEditar: (cliente: Cliente) => void
}

const ClienteList: React.FC<ClienteListProps> = ({ onNovo, onEditar }) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadClientes = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/clientes', { params: { page: pageNum, limit: 10 } })
      const payload = res.data?.data
      const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
      setClientes(data)
      setPage(payload?.page || pageNum)
      setTotalPages(payload?.pages || 1)
    } catch {
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadClientes(page) }, [page, loadClientes])

  const handleExcluir = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      await api.delete(`/clientes/${id}`)
      setSuccess('Cliente excluído com sucesso')
      loadClientes(page)
    } catch {
      setError('Erro ao excluir cliente')
    }
  }

  return (
    <div>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <button type="button" onClick={onNovo} style={{ marginBottom: '16px' }}>
        + Novo Cliente
      </button>
      {loading ? (
        <p>Carregando clientes...</p>
      ) : clientes.length === 0 ? (
        <p>Nenhum cliente cadastrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.telefone || '-'}</td>
                <td>{cliente.email || '-'}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => onEditar(cliente)}>Editar</button>
                  <button type="button" onClick={() => handleExcluir(cliente.id)}>Excluir</button>
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

export default ClienteList