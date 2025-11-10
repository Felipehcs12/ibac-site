import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/Auth.jsx'

export default function Events({ embed }) {
  const { apiUrl } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(apiUrl + '/api/events')
      .then(r => r.json())
      .then(d => mounted && setList(Array.isArray(d)? d : []))
      .catch(() => mounted && setList([]))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [apiUrl])

  const Empty = <div className="text-center text-gray-500">Nenhum evento cadastrado.</div>
  const Feed = (
    <div className="grid grid-feed gap-5">
      {list.map(ev=>(
        <div className="card event" key={ev._id}>
          <div className="title">{ev.title}</div>
          <div className="meta">
            <span className="item">🗓️ {new Date(ev.date).toLocaleString()}</span>
            {ev.location && <span className="item">📍 {ev.location}</span>}
          </div>
          {ev.description && <p className="desc">{ev.description}</p>}
        </div>
      ))}
    </div>
  )

  if (embed) return loading ? <div className="text-center text-gray-400">Carregando…</div> : (list.length ? Feed : Empty)

  return (
    <div className="section-band alt">
      <div className="container-limit">
        <h1 className="text-3xl font-extrabold mb-2">Próximos Eventos</h1>
        <p className="text-gray-600 mb-8">Venha participar conosco</p>
        {loading ? <div className="text-gray-400">Carregando…</div> : (list.length ? Feed : Empty)}
      </div>
    </div>
  )
}
