const API = import.meta.env.VITE_API_URL || '' // ex.: http://localhost:4000

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function listUsers({ q = '', page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ q, page, limit })
  const res = await fetch(`${API}/api/users?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })
  if (!res.ok) throw new Error('Falha ao listar usuários')
  return res.json()
}

export async function getUser(id) {
  const res = await fetch(`${API}/api/users/${id}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })
  if (!res.ok) throw new Error('Falha ao buscar usuário')
  return res.json()
}

export async function createUser(payload) {
  const res = await fetch(`${API}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(()=>({}))
    throw new Error(err.error || 'Falha ao criar usuário')
  }
  return res.json()
}

export async function updateUser(id, payload) {
  const res = await fetch(`${API}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Falha ao atualizar usuário')
  return res.json()
}

export async function deleteUser(id) {
  const res = await fetch(`${API}/api/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })
  if (!res.ok) throw new Error('Falha ao remover usuário')
  return res.json()
}
