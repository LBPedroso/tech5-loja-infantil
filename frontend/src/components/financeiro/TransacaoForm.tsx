import React, { useState } from 'react'
import api from '../../services/api'
import AlertMessage from '../ui/AlertMessage'

interface TransacaoFormProps {
  onSalvo: () => void
  onCancelar: () => void
}

interface LocalFormState {
  tipo: string
  valor: string
  descricao: string
  data: string
}

const TransacaoForm: React.FC<TransacaoFormProps> = ({ onSalvo, onCancelar }) => {
  const [form, setForm] = useState<LocalFormState>({
    tipo: 'ENTRADA',
    valor: '',
    descricao: '',
    data: new Date().toISOString().slice(0, 10),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.valor || parseFloat(form.valor) <= 0) {
      setError('Valor deve ser maior que zero')
      return
    }
    setLoading(true)
    try {
      await api.post('/financeiro', {
        tipo: form.tipo,
        valor: parseFloat(form.valor),
        descricao: form.descricao || undefined,
        data: form.data || undefined,
      })
      onSalvo()
    } catch {
      setError('Erro ao salvar transação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Nova Transação</h3>
      <AlertMessage type="error" message={error} />
      <form onSubmit={handleSubmit}>
        <label>Tipo *</label>
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="ENTRADA">ENTRADA (receita)</option>
          <option value="SAIDA">SAÍDA (despesa)</option>
        </select>

        <label>Valor (R$) *</label>
        <input
          type="number"
          name="valor"
          value={form.valor}
          onChange={handleChange}
          placeholder="0,00"
          min="0.01"
          step="0.01"
        />

        <label>Descrição</label>
        <input
          type="text"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Ex: Venda de peças, Aluguel..."
        />

        <label>Data</label>
        <input type="date" name="data" value={form.data} onChange={handleChange} />

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={onCancelar} style={{ background: '#aaa' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransacaoForm
