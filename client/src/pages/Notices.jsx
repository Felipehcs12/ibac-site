import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/Auth.jsx'

export default function Notices({ embed }) {
  const { apiUrl } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(apiUrl + '/api/notices')
      .then(r => r.json())
      .then(d => mounted && setItems(Array.isArray(d)? d : []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [apiUrl])

  const Empty = <div className="text-center text-gray-500">Sem avisos por enquanto.</div>
  const Feed = (
    <div className="grid grid-feed gap-5">
      {items.map(n=>(
        <div className="card notice" key={n._id}>
          <div className="title">{n.title}</div>
          <div className="meta"><span className="item">🕒 Publicado em {new Date(n.createdAt).toLocaleDateString()}</span></div>
          {n.content && <p className="desc">{n.content}</p>}
        </div>
      ))}
    </div>
  )

  if (embed) return loading ? <div className="text-center text-gray-400">Carregando…</div> : (items.length ? Feed : Empty)

  return (
    <div className="section-band">
      <div className="container-limit">
        <h1 className="text-3xl font-extrabold mb-2">Avisos</h1>
        <p className="text-gray-600 mb-8">Fique por dentro das novidades</p>
        {loading ? <div className="text-gray-400">Carregando…</div> : (items.length ? Feed : Empty)}
      </div>
    </div>
  )
}
