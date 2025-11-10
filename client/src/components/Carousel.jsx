import { useEffect, useState } from 'react'

const slides = [
  {
    id: 1,
    title: 'Bem-vindo à IBAC',
    subtitle: 'Uma igreja que acolhe e transforma vidas',
    image: 'https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Jesus é o centro',
    subtitle: 'Celebre conosco',
    image: 'https://images.unsplash.com/photo-1540040598531-6c0d77bdc5c2?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Comunidade e serviço',
    subtitle: 'Participe dos ministérios',
    image: 'https://images.unsplash.com/photo-1486673748761-a8d18475c757?q=80&w=1974&auto=format&fit=crop'
  },
]

export default function Carousel() {
  const [idx, setIdx] = useState(0)
  useEffect(() => { const t = setInterval(()=> setIdx(i => (i+1)%slides.length), 6000); return () => clearInterval(t) }, [])
  const s = slides[idx]

  return (
    <div className="relative">
      <div className="hero" style={{background:`url('${s.image}') center/cover no-repeat`}}>
        <div className="container-limit inner">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{s.title}</h1>
          <p className="text-lg opacity-90">{s.subtitle}</p>
        </div>
      </div>

      {/* dots */}
      <div className="carousel-dots">
        {slides.map((_,i)=>(
          <span key={i} className={`dot ${i===idx?'active':''}`} onClick={()=>setIdx(i)} />
        ))}
      </div>

      {/* arrows */}
      <div className="arrow left"><button className="btn" onClick={()=>setIdx((idx-1+slides.length)%slides.length)}>‹</button></div>
      <div className="arrow right"><button className="btn" onClick={()=>setIdx((idx+1)%slides.length)}>›</button></div>
    </div>
  )
}
