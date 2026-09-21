import React, { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import AlertMessage from '../ui/AlertMessage'

type Role = 'ADMIN' | 'ESTOQUE' | 'VENDEDOR' | 'CAIXA' | 'USER'

interface AdminUser {
  id: string
  nome: string
  email: string
  cpf: string
  role: Role
}

const UsuariosSection: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<Record<string, Role>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/admin/users')
      const payload = res.data?.data
      const data: AdminUser[] = Array.isArray(payload) ? payload : []
      setUsers(data)
      setRoles(data.reduce((acc: Record<string, Role>, user) => {
        acc[user.id] = user.role
        return acc
      }, {}))
    } catch {
      setError('Erro ao carregar usuários. Verifique se o perfil logado é administrador.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleSalvarRole = async (userId: string) => {
    setError('')
    setSuccess('')
    try {
      const role = roles[userId]
      await api.patch(`/admin/users/${userId}/role`, { role })
      setSuccess('Permissão atualizada com sucesso')
      await loadUsers()
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error
      setError(message || 'Erro ao atualizar permissão')
    }
  }

  return (
    <div>
      <h2>Usuários e Permissões</h2>
      <p style={{ marginBottom: '12px' }}>Controle o que cada usuário pode gerenciar no sistema.</p>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />

      {loading ? (
        <p>Carregando usuários...</p>
      ) : users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Perfil</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.cpf || '-'}</td>
                <td>
                  <select
                    value={roles[user.id] || user.role}
                    onChange={(e) => setRoles((prev) => ({ ...prev, [user.id]: e.target.value as Role }))}
                  >
                    <option value="USER">USER</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="ESTOQUE">ESTOQUE</option>
                    <option value="CAIXA">CAIXA</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button type="button" onClick={() => handleSalvarRole(user.id)}>
                    Salvar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UsuariosSection