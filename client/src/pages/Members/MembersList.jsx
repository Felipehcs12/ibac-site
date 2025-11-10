import { useEffect, useState } from 'react'
import { listUsers, deleteUser } from '../../api/users'
import { Link, useNavigate } from 'react-router-dom'

export default function MembersList() {
  const [q, setQ] = useState('')
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0, limit: 20 })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function load(page = 1) {
    setLoading(true)
    try {
      const res = await listUsers({ q, page, limit: 10 })
      setData(res)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(1) }, [])

  function onSearch(e) {
    e.preventDefault()
    load(1)
  }

  async function onRemove(id) {
    if (!confirm('Remover este membro?')) return
    try {
      await deleteUser(id)
      load(data.page)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="container-limit section-band">
      <div className="flex items-center justify-between mb-4">
        <h1 className="page-title text-2xl">Membros</h1>
        <button
          className="btn-gold px-3"
          onClick={() => navigate('/membros/novo')}
        >
          + Novo membro
        </button>
      </div>

      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input
          className="input-ibac"
          placeholder="Buscar por nome ou e-mail"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-outline-gold px-3">Buscar</button>
      </form>

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">E-mail</th>
                  <th className="text-left p-3">Função</th>
                  <th className="text-left p-3">Cargo</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.position || '-'}</td>
                    <td className="p-3 text-right">
                      <Link to={`/membros/${u._id}`} className="link-gold mr-3">Ver</Link>
                      <Link to={`/membros/${u._id}/editar`} className="text-amber-600 font-semibold mr-3">Editar</Link>
                      <button onClick={() => onRemove(u._id)} className="text-red-600 font-semibold">Remover</button>
                    </td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr><td colSpan="5" className="p-6 text-center text-gray-500">Nenhum membro encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-600">
              Total: {data.total} • Página {data.page}/{data.pages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={data.page <= 1}
                onClick={() => load(data.page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ◀ Anterior
              </button>
              <button
                disabled={data.page >= data.pages}
                onClick={() => load(data.page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Próxima ▶
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
