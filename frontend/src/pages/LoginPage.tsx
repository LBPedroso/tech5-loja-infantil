import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { emailRegex } from '../utils/validators'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!emailRegex.test(email.trim())) {
      setError('Informe um email válido')
      return
    }

    setLoading(true)

    try {
      await login(email, senha)
      navigate('/dashboard')
    } catch (err: unknown) {
      const responseData = (err as {
        response?: {
          data?: {
            error?: string
            message?: string
          }
        }
        message?: string
      }).response?.data

      setError(responseData?.error || responseData?.message || (err as { message?: string }).message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <span className="auth-kicker">Painel Administrativo</span>
        <h2 className="brand-title auth-title">Lili&Gu Moda Infantil</h2>
        <p className="auth-subtitle">Acesse sua conta para gerenciar o catalogo infantil da loja.</p>
        <h1 style={{ marginBottom: '10px' }}>Login</h1>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to="/signup">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
