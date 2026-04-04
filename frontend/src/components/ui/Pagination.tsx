import React from 'react'

interface PaginationProps {
  page: number
  totalPages: number
  loading?: boolean
  onPrev: () => void
  onNext: () => void
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, loading, onPrev, onNext }) => (
  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
    <button type="button" disabled={page <= 1 || loading} onClick={onPrev}>
      Anterior
    </button>
    <span>Página {page} de {totalPages}</span>
    <button type="button" disabled={page >= totalPages || loading} onClick={onNext}>
      Próxima
    </button>
  </div>
)

export default Pagination
