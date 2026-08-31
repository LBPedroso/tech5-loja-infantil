import React, { useEffect, useRef, useState } from 'react'
import api from '../../services/api'
import { Categoria, Produto } from '../../types'
import AlertMessage from '../ui/AlertMessage'

interface ProdutoFormProps {
  produto: Produto | null
  onSalvar: () => void
  onCancelar: () => void
}

const extractError = (err: unknown): string => {
  const data = (err as { response?: { data?: { error?: string; message?: string } } }).response?.data
  return data?.error || data?.message || 'Erro ao salvar produto'
}

const CATEGORIA_PADRAO_NOME = 'Sem categoria'

const ProdutoForm: React.FC<ProdutoFormProps> = ({ produto, onSalvar, onCancelar }) => {
  const [nome, setNome] = useState(produto?.nome || '')
  const [descricao, setDescricao] = useState(produto?.descricao || '')
  const [imagemUrl, setImagemUrl] = useState(produto?.imagemUrl || '')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(produto?.imagemUrl || '')
  const [preco, setPreco] = useState(produto ? String(produto.preco) : '')
  const [custo, setCusto] = useState(produto ? String(produto.custo) : '')
  const [quantidade, setQuantidade] = useState(produto ? String(produto.quantidade) : '')
  const [categoriaId, setCategoriaId] = useState(produto?.categoriaId || '')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const galleryInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    api.get('/categorias', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const payload = res.data?.data
        const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
        setCategorias(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem válido')
      return
    }

    // Evita upload desnecessariamente pesado no cliente.
    if (file.size > 3 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 3MB')
      return
    }

    setError('')
    setSelectedImageFile(file)
    setImagemUrl('')
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(URL.createObjectURL(file))
    e.target.value = ''
  }

  const uploadImageIfNeeded = async (): Promise<string | undefined> => {
    if (!selectedImageFile) {
      return imagemUrl.trim() || undefined
    }

    const formData = new FormData()
    formData.append('imagem', selectedImageFile)

    setUploadingImage(true)
    try {
      const response = await api.post('/uploads/produtos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = response.data?.data?.url ?? response.data?.url
      if (!url) {
        throw new Error('Upload não retornou URL da imagem')
      }
      return url
    } finally {
      setUploadingImage(false)
    }
  }

  const handleOpenGallery = () => {
    galleryInputRef.current?.click()
  }

  const handleOpenCamera = () => {
    cameraInputRef.current?.click()
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

    try {
      let categoriaFinalId = categoriaId
      const imagemFinalUrl = await uploadImageIfNeeded()

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
        imagemUrl: imagemFinalUrl,
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
        <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: 'none' }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageFileChange} style={{ display: 'none' }} />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" onClick={handleOpenGallery} style={{ background: '#4a7cf3' }}>
            Escolher da galeria
          </button>
          <button type="button" onClick={handleOpenCamera} style={{ background: '#0ea5a6' }}>
            Tirar foto
          </button>
        </div>
        <p style={{ marginTop: '-4px', color: '#5f5a66' }}>No celular, você pode escolher da galeria ou abrir a câmera.</p>
        {uploadingImage && <p style={{ marginTop: '-6px', marginBottom: '4px' }}>Enviando imagem...</p>}
        {(previewUrl.trim() || imagemUrl.trim()) && (
          <button
            type="button"
            onClick={() => {
              setSelectedImageFile(null)
              setImagemUrl('')
              if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
              }
              setPreviewUrl('')
            }}
            style={{ width: 'fit-content' }}
          >
            Remover foto
          </button>
        )}
        {(previewUrl.trim() || imagemUrl.trim()) && (
          <img className="produto-form-preview" src={previewUrl.trim() || imagemUrl.trim()} alt="Pré-visualização da foto do produto" />
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
