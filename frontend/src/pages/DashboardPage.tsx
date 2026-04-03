import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Categoria, Pedido, Produto } from '../types'
import { isValidCpf, passwordRules } from '../utils/validators'

const DashboardPage: React.FC = () => {
  const { user, logout, editUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const formatDate = (value: string) =>
    new Date(value).toLocaleString('pt-BR')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaNome, setCategoriaNome] = useState('')
  const [categoriaDescricao, setCategoriaDescricao] = useState('')
  const [editingCategoriaId, setEditingCategoriaId] = useState<string | null>(null)
  const [loadingCategorias, setLoadingCategorias] = useState(false)
  const [categoriaError, setCategoriaError] = useState('')
  const [categoriaSuccess, setCategoriaSuccess] = useState('')
  const [categoriaPage, setCategoriaPage] = useState(1)
  const [categoriaPages, setCategoriaPages] = useState(1)

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoNome, setProdutoNome] = useState('')
  const [produtoDescricao, setProdutoDescricao] = useState('')
  const [produtoPreco, setProdutoPreco] = useState('')
  const [produtoQuantidade, setProdutoQuantidade] = useState('')
  const [produtoCategoriaId, setProdutoCategoriaId] = useState('')
  const [editingProdutoId, setEditingProdutoId] = useState<string | null>(null)
  const [loadingProdutos, setLoadingProdutos] = useState(false)
  const [produtoError, setProdutoError] = useState('')
  const [produtoSuccess, setProdutoSuccess] = useState('')
  const [produtoPage, setProdutoPage] = useState(1)
  const [produtoPages, setProdutoPages] = useState(1)

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidoProdutoId, setPedidoProdutoId] = useState('')
  const [pedidoQuantidade, setPedidoQuantidade] = useState('1')
  const [pedidoStatusEdit, setPedidoStatusEdit] = useState<Record<string, string>>({})
  const [loadingPedidos, setLoadingPedidos] = useState(false)
  const [pedidoError, setPedidoError] = useState('')
  const [pedidoSuccess, setPedidoSuccess] = useState('')
  const [pedidoPage, setPedidoPage] = useState(1)
  const [pedidoPages, setPedidoPages] = useState(1)

  const [perfilNome, setPerfilNome] = useState('')
  const [perfilCpf, setPerfilCpf] = useState('')
  const [perfilSenha, setPerfilSenha] = useState('')
  const [perfilSenhaConfirm, setPerfilSenhaConfirm] = useState('')
  const [perfilError, setPerfilError] = useState('')
  const [perfilSuccess, setPerfilSuccess] = useState('')

  const pageSize = 10

  const extractApiError = (error: unknown, fallback: string) => {
    const responseData = (error as {
      response?: {
        data?: {
          error?: string
          errors?: Array<{ message?: string }>
        }
      }
    }).response?.data

    const validationMessage = responseData?.errors
      ?.map((item) => item.message)
      .find((message): message is string => Boolean(message))

    return validationMessage || responseData?.error || fallback
  }

  const loadCategorias = async (page: number = categoriaPage) => {
    setLoadingCategorias(true)
    setCategoriaError('')

    try {
      const response = await api.get('/categorias', {
        params: {
          page,
          limit: pageSize,
        },
      })

      const payload = response.data?.data
      const categoriasData = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : []

      setCategorias(categoriasData)
      setCategoriaPage(payload?.page || page)
      setCategoriaPages(payload?.pages || 1)
    } catch (error: unknown) {
      setCategoriaError(extractApiError(error, 'Erro ao carregar categorias'))
    } finally {
      setLoadingCategorias(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'categorias') {
      loadCategorias()
    }
  }, [activeTab, categoriaPage])

  const loadProdutos = async (page: number = produtoPage, limit: number = pageSize) => {
    setLoadingProdutos(true)
    setProdutoError('')

    try {
      const response = await api.get('/produtos', {
        params: {
          page,
          limit,
        },
      })

      const payload = response.data?.data
      const produtosData = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : []

      setProdutos(produtosData)
      setProdutoPage(payload?.page || page)
      setProdutoPages(payload?.pages || 1)
    } catch (error: unknown) {
      setProdutoError(extractApiError(error, 'Erro ao carregar produtos'))
    } finally {
      setLoadingProdutos(false)
    }
  }

  const loadPedidos = async (page: number = pedidoPage) => {
    setLoadingPedidos(true)
    setPedidoError('')

    try {
      const response = await api.get('/pedidos', {
        params: {
          page,
          limit: pageSize,
        },
      })

      const payload = response.data?.data
      const pedidosData = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : []

      setPedidos(pedidosData)
      setPedidoPage(payload?.page || page)
      setPedidoPages(payload?.pages || 1)
      setPedidoStatusEdit(
        pedidosData.reduce((acc: Record<string, string>, pedido: Pedido) => {
          acc[pedido.id] = pedido.status
          return acc
        }, {})
      )
    } catch (error: unknown) {
      setPedidoError(extractApiError(error, 'Erro ao carregar pedidos'))
    } finally {
      setLoadingPedidos(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'produtos') {
      loadCategorias()
      loadProdutos()
    }

    if (activeTab === 'pedidos') {
      loadProdutos(1, 100)
      loadPedidos()
    }
  }, [activeTab, produtoPage, pedidoPage])

  useEffect(() => {
    setPerfilNome(user?.nome || '')
    setPerfilCpf(user?.cpf || '')
  }, [user])

  const resetCategoriaForm = () => {
    setCategoriaNome('')
    setCategoriaDescricao('')
    setEditingCategoriaId(null)
  }

  const handleCategoriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCategoriaError('')
    setCategoriaSuccess('')

    if (categoriaNome.trim().length < 3) {
      setCategoriaError('Nome da categoria deve ter pelo menos 3 caracteres')
      return
    }

    try {
      if (editingCategoriaId) {
        await api.put(`/categorias/${editingCategoriaId}`, {
          nome: categoriaNome.trim(),
          descricao: categoriaDescricao.trim() || undefined,
        })
        setCategoriaSuccess('Categoria atualizada com sucesso')
      } else {
        await api.post('/categorias', {
          nome: categoriaNome.trim(),
          descricao: categoriaDescricao.trim() || undefined,
        })
        setCategoriaSuccess('Categoria criada com sucesso')
      }

      resetCategoriaForm()
      await loadCategorias()
    } catch (error: unknown) {
      setCategoriaError(extractApiError(error, 'Erro ao salvar categoria'))
    }
  }

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaNome(categoria.nome)
    setCategoriaDescricao(categoria.descricao || '')
    setEditingCategoriaId(categoria.id)
    setCategoriaError('')
    setCategoriaSuccess('')
  }

  const handleExcluirCategoria = async (id: string) => {
    setCategoriaError('')
    setCategoriaSuccess('')

    try {
      await api.delete(`/categorias/${id}`)
      setCategoriaSuccess('Categoria excluída com sucesso')

      if (editingCategoriaId === id) {
        resetCategoriaForm()
      }

      await loadCategorias()
    } catch (error: unknown) {
      setCategoriaError(extractApiError(error, 'Erro ao excluir categoria'))
    }
  }

  const resetProdutoForm = () => {
    setProdutoNome('')
    setProdutoDescricao('')
    setProdutoPreco('')
    setProdutoQuantidade('')
    setProdutoCategoriaId('')
    setEditingProdutoId(null)
  }

  const handleProdutoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProdutoError('')
    setProdutoSuccess('')

    if (produtoNome.trim().length < 3) {
      setProdutoError('Nome do produto deve ter pelo menos 3 caracteres')
      return
    }

    if (!produtoCategoriaId) {
      setProdutoError('Selecione uma categoria')
      return
    }

    const precoNumero = Number(produtoPreco)
    const quantidadeNumero = Number(produtoQuantidade)

    if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      setProdutoError('Preço deve ser maior que zero')
      return
    }

    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero < 0) {
      setProdutoError('Quantidade deve ser um número inteiro maior ou igual a zero')
      return
    }

    try {
      const payload = {
        nome: produtoNome.trim(),
        descricao: produtoDescricao.trim() || undefined,
        preco: precoNumero,
        quantidade: quantidadeNumero,
        categoriaId: produtoCategoriaId,
      }

      if (editingProdutoId) {
        await api.put(`/produtos/${editingProdutoId}`, payload)
        setProdutoSuccess('Produto atualizado com sucesso')
      } else {
        await api.post('/produtos', payload)
        setProdutoSuccess('Produto criado com sucesso')
      }

      resetProdutoForm()
      await loadProdutos()
    } catch (error: unknown) {
      setProdutoError(extractApiError(error, 'Erro ao salvar produto'))
    }
  }

  const handleEditarProduto = (produto: Produto) => {
    setProdutoNome(produto.nome)
    setProdutoDescricao(produto.descricao || '')
    setProdutoPreco(String(produto.preco))
    setProdutoQuantidade(String(produto.quantidade))
    setProdutoCategoriaId(produto.categoriaId)
    setEditingProdutoId(produto.id)
    setProdutoError('')
    setProdutoSuccess('')
  }

  const handleExcluirProduto = async (id: string) => {
    setProdutoError('')
    setProdutoSuccess('')

    try {
      await api.delete(`/produtos/${id}`)
      setProdutoSuccess('Produto excluído com sucesso')

      if (editingProdutoId === id) {
        resetProdutoForm()
      }

      await loadProdutos()
    } catch (error: unknown) {
      setProdutoError(extractApiError(error, 'Erro ao excluir produto'))
    }
  }

  const handlePedidoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPedidoError('')
    setPedidoSuccess('')

    const quantidade = Number(pedidoQuantidade)

    if (!pedidoProdutoId) {
      setPedidoError('Selecione um produto')
      return
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      setPedidoError('Quantidade deve ser um inteiro maior que zero')
      return
    }

    try {
      await api.post('/pedidos', {
        itens: [{ produtoId: pedidoProdutoId, quantidade }],
      })

      setPedidoSuccess('Pedido criado com sucesso')
      setPedidoProdutoId('')
      setPedidoQuantidade('1')

      await Promise.all([loadPedidos(), loadProdutos()])
    } catch (error: unknown) {
      setPedidoError(extractApiError(error, 'Erro ao criar pedido'))
    }
  }

  const handleAtualizarStatusPedido = async (pedidoId: string) => {
    setPedidoError('')
    setPedidoSuccess('')

    try {
      await api.put(`/pedidos/${pedidoId}/status`, {
        status: pedidoStatusEdit[pedidoId] || 'PENDENTE',
      })

      setPedidoSuccess('Status do pedido atualizado')
      await loadPedidos()
    } catch (error: unknown) {
      setPedidoError(extractApiError(error, 'Erro ao atualizar status do pedido'))
    }
  }

  const handleExcluirPedido = async (pedidoId: string) => {
    setPedidoError('')
    setPedidoSuccess('')

    try {
      await api.delete(`/pedidos/${pedidoId}`)
      setPedidoSuccess('Pedido excluído com sucesso')
      await Promise.all([loadPedidos(), loadProdutos()])
    } catch (error: unknown) {
      setPedidoError(extractApiError(error, 'Erro ao excluir pedido'))
    }
  }

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setPerfilError('')
    setPerfilSuccess('')

    if (perfilNome.trim().length < 3) {
      setPerfilError('Nome deve ter pelo menos 3 caracteres')
      return
    }

    const cpfLimpo = perfilCpf.replace(/\D/g, '')
    if (!isValidCpf(cpfLimpo)) {
      setPerfilError('CPF inválido')
      return
    }

    const novaSenha = perfilSenha.trim()
    const confirmacaoSenha = perfilSenhaConfirm.trim()

    if (novaSenha || confirmacaoSenha) {
      if (novaSenha !== confirmacaoSenha) {
        setPerfilError('A confirmação da senha não confere')
        return
      }

      if (!passwordRules.test(novaSenha)) {
        setPerfilError('Senha deve ter 8+ caracteres, 1 maiúscula, 1 número e 1 especial (!@#$%^&*)')
        return
      }
    }

    try {
      await editUser(perfilNome.trim(), cpfLimpo, novaSenha || undefined)
      setPerfilSuccess('Perfil atualizado com sucesso')
      setPerfilSenha('')
      setPerfilSenhaConfirm('')
    } catch (error: unknown) {
      setPerfilError(extractApiError(error, 'Erro ao atualizar perfil'))
    }
  }

  const produtosComEstoque = useMemo(
    () => produtos.filter((produto) => produto.quantidade > 0),
    [produtos]
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <nav className="nav">
        <div><h2>Lili&Gu Moda Infantil</h2></div>
        <div>
          <span>Bem-vindo, {user?.nome}</span>
          <button onClick={handleLogout} style={{ marginLeft: '20px' }}>
            Sair
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <h1>Dashboard</h1>
          <p>Bem-vindo ao sistema da Lili&Gu Moda Infantil.</p>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setActiveTab('dashboard')}>
              Home
            </button>
            <button onClick={() => setActiveTab('categorias')}>
              Categorias
            </button>
            <button onClick={() => setActiveTab('produtos')}>
              Produtos
            </button>
            <button onClick={() => setActiveTab('pedidos')}>
              Pedidos
            </button>
            <button onClick={() => setActiveTab('perfil')}>
              Meu Perfil
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            {activeTab === 'dashboard' && (
              <div>
                <h2>Painel da Lili&Gu</h2>
                <p>Seus dados cadastrados:</p>
                <ul>
                  <li><strong>Nome:</strong> {user?.nome}</li>
                  <li><strong>Email:</strong> {user?.email}</li>
                  <li><strong>CPF:</strong> {user?.cpf}</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'categorias' && (
              <div>
                <h2>Categorias</h2>
                <p style={{ marginTop: '6px', marginBottom: '10px' }}>Exemplos: Bodies, Conjuntos, Vestidos, Calcas, Acessorios.</p>
                {categoriaError && <div className="error">{categoriaError}</div>}
                {categoriaSuccess && <div className="success">{categoriaSuccess}</div>}

                <form onSubmit={handleCategoriaSubmit} style={{ marginTop: '16px' }}>
                  <input
                    type="text"
                    placeholder="Nome da categoria infantil"
                    value={categoriaNome}
                    onChange={(e) => setCategoriaNome(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Descrição (opcional)"
                    value={categoriaDescricao}
                    onChange={(e) => setCategoriaDescricao(e.target.value)}
                    rows={3}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit">
                      {editingCategoriaId ? 'Salvar edição' : 'Criar categoria'}
                    </button>
                    {editingCategoriaId && (
                      <button type="button" onClick={resetCategoriaForm}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                <div style={{ marginTop: '20px' }}>
                  <h3>Lista de categorias</h3>
                  {loadingCategorias ? (
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
                        {categorias.map((categoria) => (
                          <tr key={categoria.id}>
                            <td>{categoria.nome}</td>
                            <td>{categoria.descricao || '-'}</td>
                            <td style={{ display: 'flex', gap: '8px' }}>
                              <button type="button" onClick={() => handleEditarCategoria(categoria)}>
                                Editar
                              </button>
                              <button type="button" onClick={() => handleExcluirCategoria(categoria.id)}>
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={categoriaPage <= 1 || loadingCategorias}
                      onClick={() => setCategoriaPage((prev) => Math.max(1, prev - 1))}
                    >
                      Anterior
                    </button>
                    <span>Página {categoriaPage} de {categoriaPages}</span>
                    <button
                      type="button"
                      disabled={categoriaPage >= categoriaPages || loadingCategorias}
                      onClick={() => setCategoriaPage((prev) => Math.min(categoriaPages, prev + 1))}
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'produtos' && (
              <div>
                <h2>Produtos</h2>
                <p style={{ marginTop: '6px', marginBottom: '10px' }}>Cadastre pecas infantis com preco e estoque.</p>
                {produtoError && <div className="error">{produtoError}</div>}
                {produtoSuccess && <div className="success">{produtoSuccess}</div>}

                <form onSubmit={handleProdutoSubmit} style={{ marginTop: '16px' }}>
                  <input
                    type="text"
                    placeholder="Nome da peca infantil"
                    value={produtoNome}
                    onChange={(e) => setProdutoNome(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Descrição (opcional)"
                    value={produtoDescricao}
                    onChange={(e) => setProdutoDescricao(e.target.value)}
                    rows={3}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Preço"
                    value={produtoPreco}
                    onChange={(e) => setProdutoPreco(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Quantidade em estoque (pecas)"
                    value={produtoQuantidade}
                    onChange={(e) => setProdutoQuantidade(e.target.value)}
                    required
                  />
                  <select
                    value={produtoCategoriaId}
                    onChange={(e) => setProdutoCategoriaId(e.target.value)}
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit">
                      {editingProdutoId ? 'Salvar edição' : 'Criar produto'}
                    </button>
                    {editingProdutoId && (
                      <button type="button" onClick={resetProdutoForm}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                <div style={{ marginTop: '20px' }}>
                  <h3>Lista de produtos</h3>
                  {loadingProdutos ? (
                    <p>Carregando produtos...</p>
                  ) : produtos.length === 0 ? (
                    <p>Nenhum produto cadastrado.</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Categoria</th>
                          <th>Preço</th>
                          <th>Estoque</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produtos.map((produto) => (
                          <tr key={produto.id}>
                            <td>{produto.nome}</td>
                            <td>{produto.categoria?.nome || '-'}</td>
                            <td>{formatCurrency(produto.preco)}</td>
                            <td>{produto.quantidade}</td>
                            <td style={{ display: 'flex', gap: '8px' }}>
                              <button type="button" onClick={() => handleEditarProduto(produto)}>
                                Editar
                              </button>
                              <button type="button" onClick={() => handleExcluirProduto(produto.id)}>
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={produtoPage <= 1 || loadingProdutos}
                      onClick={() => setProdutoPage((prev) => Math.max(1, prev - 1))}
                    >
                      Anterior
                    </button>
                    <span>Página {produtoPage} de {produtoPages}</span>
                    <button
                      type="button"
                      disabled={produtoPage >= produtoPages || loadingProdutos}
                      onClick={() => setProdutoPage((prev) => Math.min(produtoPages, prev + 1))}
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pedidos' && (
              <div>
                <h2>Meus Pedidos</h2>
                <p style={{ marginTop: '6px', marginBottom: '10px' }}>Registre pedidos de roupas infantis e acompanhe os status.</p>
                {pedidoError && <div className="error">{pedidoError}</div>}
                {pedidoSuccess && <div className="success">{pedidoSuccess}</div>}

                <form onSubmit={handlePedidoSubmit} style={{ marginTop: '16px' }}>
                  <select
                    value={pedidoProdutoId}
                    onChange={(e) => setPedidoProdutoId(e.target.value)}
                    required
                  >
                    <option value="">Selecione o produto</option>
                    {produtosComEstoque.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} - estoque: {produto.quantidade}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={pedidoQuantidade}
                    onChange={(e) => setPedidoQuantidade(e.target.value)}
                    required
                  />
                  <button type="submit">Criar pedido</button>
                </form>

                <div style={{ marginTop: '20px' }}>
                  <h3>Lista de pedidos</h3>
                  {loadingPedidos ? (
                    <p>Carregando pedidos...</p>
                  ) : pedidos.length === 0 ? (
                    <p>Nenhum pedido cadastrado.</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Criado em</th>
                          <th>Itens</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidos.map((pedido) => (
                          <tr key={pedido.id}>
                            <td>{pedido.id.slice(0, 8)}...</td>
                            <td>{formatCurrency(pedido.total)}</td>
                            <td>
                              <select
                                value={pedidoStatusEdit[pedido.id] || pedido.status}
                                onChange={(e) =>
                                  setPedidoStatusEdit((prev) => ({
                                    ...prev,
                                    [pedido.id]: e.target.value,
                                  }))
                                }
                              >
                                <option value="PENDENTE">PENDENTE</option>
                                <option value="PROCESSANDO">PROCESSANDO</option>
                                <option value="ENTREGUE">ENTREGUE</option>
                                <option value="CANCELADO">CANCELADO</option>
                              </select>
                            </td>
                            <td>{formatDate(pedido.createdAt)}</td>
                            <td>
                              {pedido.itens.map((item) => `${item.produto.nome} x${item.quantidade}`).join(', ')}
                            </td>
                            <td style={{ display: 'flex', gap: '8px' }}>
                              <button type="button" onClick={() => handleAtualizarStatusPedido(pedido.id)}>
                                Salvar status
                              </button>
                              <button type="button" onClick={() => handleExcluirPedido(pedido.id)}>
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={pedidoPage <= 1 || loadingPedidos}
                      onClick={() => setPedidoPage((prev) => Math.max(1, prev - 1))}
                    >
                      Anterior
                    </button>
                    <span>Página {pedidoPage} de {pedidoPages}</span>
                    <button
                      type="button"
                      disabled={pedidoPage >= pedidoPages || loadingPedidos}
                      onClick={() => setPedidoPage((prev) => Math.min(pedidoPages, prev + 1))}
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'perfil' && (
              <div>
                <h2>Meu Perfil</h2>
                {perfilError && <div className="error">{perfilError}</div>}
                {perfilSuccess && <div className="success">{perfilSuccess}</div>}

                <form onSubmit={handleSalvarPerfil} style={{ marginTop: '16px', maxWidth: '500px' }}>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={perfilNome}
                    onChange={(e) => setPerfilNome(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="CPF (apenas números)"
                    value={perfilCpf}
                    onChange={(e) => setPerfilCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    maxLength={11}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Nova senha (opcional)"
                    value={perfilSenha}
                    onChange={(e) => setPerfilSenha(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={perfilSenhaConfirm}
                    onChange={(e) => setPerfilSenhaConfirm(e.target.value)}
                  />
                  <button type="submit">Salvar perfil</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
