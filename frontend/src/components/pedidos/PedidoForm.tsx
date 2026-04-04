import React, { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { Produto } from '../../types'
import AlertMessage from '../ui/AlertMessage'

interface PedidoFormProps {
  onSalvar: () => void
  onCancelar: () => void
}

const PedidoForm: React.FC<PedidoFormProps> = ({ onSalvar, onCancelar }) => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/produtos', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const payload = res.data?.data
        const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
        setProdutos(data)
      })
      .catch(() => {})
  }, [])

  const produtosComEstoque = useMemo(() => produtos.filter((p) => p.quantidade > 0), [produtos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const qtd = Number(quantidade)
    if (!produtoId) { setError('Selecione um produto'); return }
    if (!Number.isInteger(qtd) || qtd <= 0) { setError('Quantidade deve ser um inteiro maior que zero'); return }

    try {
      await api.post('/pedidos', { itens: [{ produtoId, quantidade: qtd }] })
      setSuccess('Pedido criado com sucesso')
      setTimeout(onSalvar, 500)
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string } } }).response?.data
      setError(data?.error || 'Erro ao criar pedido')
    }
  }

  return (
    <div>
      <h3>Novo Pedido</h3>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginTop: '16px' }}>
        <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
          <option value="">Selecione o produto</option>
          {produtosComEstoque.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.nome} — estoque: {prod.quantidade}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          step="1"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">Criar pedido</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default PedidoForm
