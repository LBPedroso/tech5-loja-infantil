import React, { useState } from 'react'
import { Categoria } from '../../types'
import CategoriaList from './CategoriaList'
import CategoriaForm from './CategoriaForm'

type SectionView = 'list' | 'form'

const CategoriasSection: React.FC = () => {
  const [view, setView] = useState<SectionView>('list')
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [listVersion, setListVersion] = useState(0)

  const handleNovo = () => { setEditingCategoria(null); setView('form') }
  const handleEditar = (cat: Categoria) => { setEditingCategoria(cat); setView('form') }
  const handleVoltar = () => {
    setEditingCategoria(null)
    setListVersion((version) => version + 1)
    setView('list')
  }

  return (
    <div>
      <h2>Categorias</h2>
      <p style={{ marginBottom: '12px' }}>Exemplos: Bodies, Conjuntos, Vestidos, Calças, Acessórios.</p>
      {view === 'list' && (
        <CategoriaList key={listVersion} onNovo={handleNovo} onEditar={handleEditar} />
      )}
      {view === 'form' && (
        <CategoriaForm categoria={editingCategoria} onSalvar={handleVoltar} onCancelar={handleVoltar} />
      )}
    </div>
  )
}

export default CategoriasSection
