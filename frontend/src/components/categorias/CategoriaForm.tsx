import React, { useState } from 'react'
import api from '../../services/api'
import { Categoria } from '../../types'
import AlertMessage from '../ui/AlertMessage'

interface CategoriaFormProps {
  categoria: Categoria | null
  onSalvar: () => void
  onCancelar: () => void
}

const extractError = (err: unknown): string => {
  const data = (err as { response?: { data?: { error?: string } } }).response?.data
  return data?.error || 'Erro ao salvar categoria'
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ categoria, onSalvar, onCancelar }) => {
  const [nome, setNome] = useState(categoria?.nome || '')
  const [descricao, setDescricao] = useState(categoria?.descricao || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (nome.trim().length < 3) {
      setError('Nome da categoria deve ter pelo menos 3 caracteres')
      return
    }

    try {
      const payload = { nome: nome.trim(), descricao: descricao.trim() || undefined }
      if (categoria) {
        await api.put(`/categorias/${categoria.id}`, payload)
        setSuccess('Categoria atualizada com sucesso')
      } else {
        await api.post('/categorias', payload)
        setSuccess('Categoria criada com sucesso')
      }
      setTimeout(onSalvar, 500)
    } catch (err: unknown) {
      setError(extractError(err))
    }
  }

  return (
    <div>
      <h3>{categoria ? 'Editar Categoria' : 'Nova Categoria'}</h3>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginTop: '16px' }}>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">{categoria ? 'Salvar edição' : 'Criar categoria'}</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default CategoriaForm
