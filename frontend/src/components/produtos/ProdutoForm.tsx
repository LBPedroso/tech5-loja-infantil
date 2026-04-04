import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Categoria, Produto } from '../../types'
import AlertMessage from '../ui/AlertMessage'

interface ProdutoFormProps {
  produto: Produto | null
  onSalvar: () => void
  onCancelar: () => void
}

const extractError = (err: unknown): string => {
  const data = (err as { response?: { data?: { error?: string } } }).response?.data
  return data?.error || 'Erro ao salvar produto'
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ produto, onSalvar, onCancelar }) => {
  const [nome, setNome] = useState(produto?.nome || '')
  const [descricao, setDescricao] = useState(produto?.descricao || '')
  const [preco, setPreco] = useState(produto ? String(produto.preco) : '')
  const [quantidade, setQuantidade] = useState(produto ? String(produto.quantidade) : '')
  const [categoriaId, setCategoriaId] = useState(produto?.categoriaId || '')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/categorias', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const payload = res.data?.data
        const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
        setCategorias(data)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (nome.trim().length < 3) { setError('Nome deve ter pelo menos 3 caracteres'); return }
    if (!categoriaId) { setError('Selecione uma categoria'); return }

    const precoNum = Number(preco)
    const quantidadeNum = Number(quantidade)
    if (!Number.isFinite(precoNum) || precoNum <= 0) { setError('Preço deve ser maior que zero'); return }
    if (!Number.isInteger(quantidadeNum) || quantidadeNum < 0) { setError('Quantidade inválida'); return }

    try {
      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        preco: precoNum,
        quantidade: quantidadeNum,
        categoriaId,
      }
      if (produto) {
        await api.put(`/produtos/${produto.id}`, payload)
        setSuccess('Produto atualizado com sucesso')
      } else {
        await api.post('/produtos', payload)
        setSuccess('Produto criado com sucesso')
      }
      setTimeout(onSalvar, 500)
    } catch (err: unknown) {
      setError(extractError(err))
    }
  }

  return (
    <div>
      <h3>{produto ? 'Editar Produto' : 'Novo Produto'}</h3>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginTop: '16px' }}>
        <input type="text" placeholder="Nome do produto" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <textarea placeholder="Descrição (opcional)" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} />
        <input type="number" step="0.01" min="0.01" placeholder="Preço (R$)" value={preco} onChange={(e) => setPreco(e.target.value)} required />
        <input type="number" min="0" step="1" placeholder="Quantidade em estoque" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
          <option value="">Selecione a categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">{produto ? 'Salvar edição' : 'Criar produto'}</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default ProdutoForm
