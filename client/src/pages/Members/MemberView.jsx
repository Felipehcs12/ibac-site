import { useEffect, useState } from 'react'
import { getUser } from '../../api/users'
import { useParams, Link } from 'react-router-dom'

export default function MemberView() {
  const { id } = useParams()
  const [u, setU] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getUser(id)
        setU(data)
      } catch (e) {
        alert(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="container-limit section-band">Carregando…</div>
  if (!u) return <div className="container-limit section-band">Não encontrado.</div>

  return (
    <div className="container-limit section-band">
      <h1 className="page-title text-2xl mb-4">Detalhes do membro</h1>

      <div className="card p-5 space-y-2">
        <div><span className="font-semibold">Nome:</span> {u.name}</div>
        <div><span className="font-semibold">E-mail:</span> {u.email}</div>
        <div><span className="font-semibold">Função:</span> {u.role}</div>
        <div><span className="font-semibold">Cargo:</span> {u.position || '-'}</div>
        <div><span className="font-semibold">Nascimento:</span> {u.birthDate ? new Date(u.birthDate).toLocaleDateString() : '-'}</div>
        <div><span className="font-semibold">Criado em:</span> {new Date(u.createdAt).toLocaleString()}</div>
        <div><span className="font-semibold">Atualizado em:</span> {new Date(u.updatedAt).toLocaleString()}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to={`/membros/${u._id}/editar`} className="btn-gold px-4">Editar</Link>
        <Link to="/membros" className="btn-outline-gold px-4">Voltar</Link>
      </div>
    </div>
  )
}
