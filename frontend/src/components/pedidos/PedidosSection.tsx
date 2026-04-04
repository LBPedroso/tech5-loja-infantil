import React, { useState } from 'react'
import PedidoList from './PedidoList'
import PedidoForm from './PedidoForm'

type SectionView = 'list' | 'form'

const PedidosSection: React.FC = () => {
  const [view, setView] = useState<SectionView>('list')

  const handleNovo = () => setView('form')
  const handleVoltar = () => setView('list')

  return (
    <div>
      <h2>Pedidos</h2>
      <p style={{ marginBottom: '12px' }}>Registre e acompanhe pedidos de roupas infantis.</p>
      {view === 'list' && <PedidoList onNovo={handleNovo} />}
      {view === 'form' && <PedidoForm onSalvar={handleVoltar} onCancelar={handleVoltar} />}
    </div>
  )
}

export default PedidosSection
