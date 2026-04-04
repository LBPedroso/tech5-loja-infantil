import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { isValidCpf, passwordRules } from '../../utils/validators'
import AlertMessage from '../ui/AlertMessage'

const extractError = (err: unknown): string => {
  const data = (err as { response?: { data?: { error?: string } } }).response?.data
  return data?.error || 'Erro ao atualizar perfil'
}

const PerfilForm: React.FC = () => {
  const { user, editUser } = useAuth()
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setNome(user?.nome || '')
    setCpf(user?.cpf || '')
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (nome.trim().length < 3) { setError('Nome deve ter pelo menos 3 caracteres'); return }
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (!isValidCpf(cpfLimpo)) { setError('CPF inválido'); return }

    if (senha || senhaConfirm) {
      if (senha !== senhaConfirm) { setError('A confirmação da senha não confere'); return }
      if (!passwordRules.test(senha)) {
        setError('Senha deve ter 8+ caracteres, 1 maiúscula, 1 número e 1 especial (!@#$%^&*)')
        return
      }
    }

    try {
      await editUser(nome.trim(), cpfLimpo, senha || undefined)
      setSuccess('Perfil atualizado com sucesso')
      setSenha('')
      setSenhaConfirm('')
    } catch (err: unknown) {
      setError(extractError(err))
    }
  }

  return (
    <div>
      <h2>Meu Perfil</h2>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginTop: '16px' }}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CPF (apenas números)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
          maxLength={11}
          required
        />
        <input
          type="password"
          placeholder="Nova senha (opcional)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={senhaConfirm}
          onChange={(e) => setSenhaConfirm(e.target.value)}
        />
        <button type="submit">Salvar perfil</button>
      </form>
    </div>
  )
}

export default PerfilForm
