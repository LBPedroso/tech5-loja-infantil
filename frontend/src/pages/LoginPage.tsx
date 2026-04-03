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
          }
        }
      }).response?.data

      setError(responseData?.error || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '8px' }}>Lili&Gu Moda Infantil</h2>
        <p style={{ marginBottom: '12px' }}>Acesse sua conta para gerenciar o catalogo infantil da loja.</p>
        <h1>Login</h1>
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

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Não tem conta? <Link to="/signup">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
