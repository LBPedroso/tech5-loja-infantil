import React, { useState } from 'react'
import api from '../../services/api'
import { Cliente } from '../../types'
import AlertMessage from '../ui/AlertMessage'

interface ClienteFormProps {
  cliente: Cliente | null
  onSalvar: () => void
  onCancelar: () => void
}

const extractError = (err: unknown): string => {
  const data = (err as { response?: { data?: { error?: string } } }).response?.data
  return data?.error || 'Erro ao salvar cliente'
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSalvar, onCancelar }) => {
  const [nome, setNome] = useState(cliente?.nome || '')
  const [telefone, setTelefone] = useState(cliente?.telefone || '')
  const [email, setEmail] = useState(cliente?.email || '')
  const [observacoes, setObservacoes] = useState(cliente?.observacoes || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (nome.trim().length < 3) {
      setError('Nome do cliente deve ter pelo menos 3 caracteres')
      return
    }

    try {
      const payload = {
        nome: nome.trim(),
        telefone: telefone.trim() || undefined,
        email: email.trim() || undefined,
        observacoes: observacoes.trim() || undefined,
      }

      if (cliente) {
        await api.put(`/clientes/${cliente.id}`, payload)
        setSuccess('Cliente atualizado com sucesso')
      } else {
        await api.post('/clientes', payload)
        setSuccess('Cliente criado com sucesso')
      }

      setTimeout(onSalvar, 500)
    } catch (err: unknown) {
      setError(extractError(err))
    }
  }

  return (
    <div>
      <h3>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</h3>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <form onSubmit={handleSubmit} style={{ maxWidth: '560px', marginTop: '16px' }}>
        <input
          type="text"
          placeholder="Nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Telefone (opcional)"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Observações (opcional)"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={4}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">{cliente ? 'Salvar edição' : 'Criar cliente'}</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default ClienteForm