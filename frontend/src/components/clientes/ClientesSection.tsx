import React, { useState } from 'react'
import { Cliente } from '../../types'
import ClienteList from './ClienteList'
import ClienteForm from './ClienteForm'

type SectionView = 'list' | 'form'

const ClientesSection: React.FC = () => {
  const [view, setView] = useState<SectionView>('list')
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  const handleNovo = () => { setEditingCliente(null); setView('form') }
  const handleEditar = (cliente: Cliente) => { setEditingCliente(cliente); setView('form') }
  const handleVoltar = () => { setEditingCliente(null); setView('list') }

  return (
    <div>
      <h2>Clientes</h2>
      <p style={{ marginBottom: '12px' }}>Cadastre clientes para vincular pedidos, contatos e observações importantes.</p>
      {view === 'list' && <ClienteList onNovo={handleNovo} onEditar={handleEditar} />}
      {view === 'form' && <ClienteForm cliente={editingCliente} onSalvar={handleVoltar} onCancelar={handleVoltar} />}
    </div>
  )
}

export default ClientesSection