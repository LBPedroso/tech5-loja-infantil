import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { emailRegex, isValidCpf, passwordRules } from '../utils/validators'

const SignupPage: React.FC = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (nome.trim().length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres')
      return
    }

    if (!emailRegex.test(email.trim())) {
      setError('Informe um email válido')
      return
    }

    if (!isValidCpf(cpf)) {
      setError('CPF inválido')
      return
    }

    if (senha !== senhaConfirm) {
      setError('As senhas não conferem')
      return
    }

    if (!passwordRules.test(senha)) {
      setError('Senha deve ter 8+ caracteres, 1 maiúscula, 1 número e 1 especial (!@#$%^&*)')
      return
    }

    setLoading(true)

    try {
      await signup(nome.trim(), email.trim(), cpf, senha)
      navigate('/login')
    } catch (err: unknown) {
      const responseData = (err as {
        response?: {
          data?: {
            error?: string
            errors?: Array<{ message?: string }>
          }
        }
      }).response?.data

      const validationMessages = responseData?.errors
        ?.map((item) => item.message)
        .filter((message): message is string => Boolean(message))

      const errorMessage = validationMessages && validationMessages.length > 0
        ? validationMessages.join(' | ')
        : responseData?.error || 'Erro ao criar conta'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <span className="auth-kicker">Novo Acesso</span>
        <h2 className="brand-title auth-title">Lili&Gu Moda Infantil</h2>
        <p className="auth-subtitle">Crie sua conta para administrar o estoque de roupas infantis.</p>
        <h1 style={{ marginBottom: '10px' }}>Criar Conta</h1>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="CPF (11 dígitos)"
            value={cpf}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
            maxLength={11}
            required
          />
          <input
            type="password"
            placeholder="Senha (8+ chars, maiúscula, número, especial)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={senhaConfirm}
            onChange={(e) => setSenhaConfirm(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
