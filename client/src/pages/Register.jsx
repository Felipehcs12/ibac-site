import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/Auth.jsx'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password)
      nav('/login')
    } catch (e) { setError(e.message) }
  }

  return (
    <div className="container-limit py-10 max-w-lg">
      <h1 className="text-3xl font-extrabold mb-4">Cadastro</h1>
      <form className="card space-y-3" onSubmit={onSubmit}>
        <input className="w-full border rounded-xl px-3 py-2" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded-xl px-3 py-2" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-xl px-3 py-2" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn btn-primary w-full">Criar conta</button>
        <div className="text-sm text-center">Já tem conta? <Link to="/login" className="text-ibac-accent">Entrar</Link></div>
      </form>
    </div>
  )
}
