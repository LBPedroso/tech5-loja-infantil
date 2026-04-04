import React, { useState } from 'react'
import { Produto } from '../../types'
import ProdutoList from './ProdutoList'
import ProdutoForm from './ProdutoForm'

type SectionView = 'list' | 'form'

const ProdutosSection: React.FC = () => {
  const [view, setView] = useState<SectionView>('list')
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)

  const handleNovo = () => { setEditingProduto(null); setView('form') }
  const handleEditar = (prod: Produto) => { setEditingProduto(prod); setView('form') }
  const handleVoltar = () => { setEditingProduto(null); setView('list') }

  return (
    <div>
      <h2>Produtos</h2>
      <p style={{ marginBottom: '12px' }}>Cadastre peças infantis com preço e estoque.</p>
      {view === 'list' && (
        <ProdutoList onNovo={handleNovo} onEditar={handleEditar} />
      )}
      {view === 'form' && (
        <ProdutoForm produto={editingProduto} onSalvar={handleVoltar} onCancelar={handleVoltar} />
      )}
    </div>
  )
}

export default ProdutosSection
