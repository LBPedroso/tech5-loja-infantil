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

const CATEGORIA_PADRAO_NOME = 'Sem categoria'
const MAX_IMAGE_DATA_URL_LENGTH = 95_000

const isValidImageUrl = (value: string): boolean => {
  if (!value.trim()) return true

  if (value.startsWith('data:image/')) return true

  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Não foi possível ler a imagem'))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler arquivo de imagem'))
    reader.readAsDataURL(file)
  })

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Não foi possível processar a imagem'))
    image.src = src
  })

const compressDataUrl = async (originalDataUrl: string): Promise<string> => {
  const image = await loadImage(originalDataUrl)
  const maxSide = 900
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Não foi possível processar a imagem')
  }

  ctx.drawImage(image, 0, 0, width, height)

  let quality = 0.82
  let output = canvas.toDataURL('image/jpeg', quality)

  while (output.length > MAX_IMAGE_DATA_URL_LENGTH && quality > 0.4) {
    quality -= 0.08
    output = canvas.toDataURL('image/jpeg', quality)
  }

  return output
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ produto, onSalvar, onCancelar }) => {
  const [nome, setNome] = useState(produto?.nome || '')
  const [descricao, setDescricao] = useState(produto?.descricao || '')
  const [imagemUrl, setImagemUrl] = useState(produto?.imagemUrl || '')
  const [preco, setPreco] = useState(produto ? String(produto.preco) : '')
  const [custo, setCusto] = useState(produto ? String(produto.custo) : '')
  const [quantidade, setQuantidade] = useState(produto ? String(produto.quantidade) : '')
  const [categoriaId, setCategoriaId] = useState(produto?.categoriaId || '')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem válido')
      return
    }

    // Limite simples para evitar payload muito grande no cadastro.
    if (file.size > 3 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 3MB')
      return
    }

    setError('')
    setUploadingImage(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      const compressed = await compressDataUrl(dataUrl)

      if (compressed.length > MAX_IMAGE_DATA_URL_LENGTH) {
        setError('A foto ficou grande para envio. Use uma imagem menor ou URL da imagem.')
        return
      }

      setImagemUrl(compressed)
    } catch {
      setError('Não foi possível carregar a imagem')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (nome.trim().length < 3) { setError('Nome deve ter pelo menos 3 caracteres'); return }

    const precoNum = Number(preco)
    const custoNum = Number(custo)
    const quantidadeNum = Number(quantidade)
    if (!Number.isFinite(precoNum) || precoNum <= 0) { setError('Preço deve ser maior que zero'); return }
    if (!Number.isFinite(custoNum) || custoNum < 0) { setError('Custo não pode ser negativo'); return }
    if (!Number.isInteger(quantidadeNum) || quantidadeNum < 0) { setError('Quantidade inválida'); return }
    if (!isValidImageUrl(imagemUrl)) { setError('Informe uma URL de imagem válida (http/https)'); return }
    if (imagemUrl.startsWith('data:image/') && imagemUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
      setError('A foto está grande para envio. Reduza a imagem ou use uma URL externa.')
      return
    }

    try {
      let categoriaFinalId = categoriaId

      if (!categoriaFinalId) {
        const categoriaPadraoExistente = categorias.find(
          (cat) => cat.nome.trim().toLowerCase() === CATEGORIA_PADRAO_NOME.toLowerCase()
        )

        if (categoriaPadraoExistente) {
          categoriaFinalId = categoriaPadraoExistente.id
        } else {
          const response = await api.post('/categorias', {
            nome: CATEGORIA_PADRAO_NOME,
            descricao: 'Categoria criada automaticamente para produtos sem categoria definida',
          })

          const categoriaCriada = response.data?.data ?? response.data
          if (!categoriaCriada?.id) {
            throw new Error('Não foi possível criar categoria padrão')
          }

          categoriaFinalId = categoriaCriada.id
          setCategorias((prev) => [...prev, categoriaCriada])
          setCategoriaId(categoriaFinalId)
        }
      }

      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        imagemUrl: imagemUrl.trim() || undefined,
        preco: precoNum,
        custo: custoNum,
        quantidade: quantidadeNum,
        categoriaId: categoriaFinalId,
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
        <input
          type="url"
          placeholder="URL da foto do produto (opcional)"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageFileChange}
        />
        {uploadingImage && <p style={{ marginTop: '-6px', marginBottom: '4px' }}>Processando imagem...</p>}
        {imagemUrl.trim() && (
          <button type="button" onClick={() => setImagemUrl('')} style={{ width: 'fit-content' }}>
            Remover foto
          </button>
        )}
        {imagemUrl.trim() && isValidImageUrl(imagemUrl) && (
          <img className="produto-form-preview" src={imagemUrl.trim()} alt="Pré-visualização da foto do produto" />
        )}
        <input type="number" step="0.01" min="0.01" placeholder="Preço (R$)" value={preco} onChange={(e) => setPreco(e.target.value)} required />
        <input type="number" step="0.01" min="0" placeholder="Custo (R$)" value={custo} onChange={(e) => setCusto(e.target.value)} required />
        <input type="number" min="0" step="1" placeholder="Quantidade em estoque" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">Sem categoria</option>
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
