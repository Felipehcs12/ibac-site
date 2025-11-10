import Carousel from '../components/Carousel.jsx'
import NoticesList from './Notices.jsx'
import EventsList from './Events.jsx'

export default function Home() {
  return (
    <div>
      <Carousel />

      {/* Avisos */}
      <section className="section-band">
        <div className="container-limit">
          <h2 className="text-3xl font-extrabold text-center mb-2">Nossos Avisos</h2>
          <p className="text-center text-gray-600 mb-6">Fique por dentro das novidades</p>
          <NoticesList embed />
        </div>
      </section>

      {/* Eventos */}
      <section className="section-band alt">
        <div className="container-limit">
          <h2 className="text-3xl font-extrabold text-center mb-2">Próximos Eventos</h2>
          <p className="text-center text-gray-600 mb-6">Venha participar conosco</p>
          <EventsList embed />
        </div>
      </section>

      {/* Localização — barra roxa dentro do container + mapa arredondado */}
      <section className="section-band">
        <div className="container-limit">
          <h2 className="text-3xl font-extrabold text-center mb-2">Nossa Localização</h2>
          <p className="text-center text-gray-600 mb-6">Venha nos visitar</p>

          <div className="bg-ibac-accent text-white px-5 py-4 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="font-semibold leading-snug">
              Rua Eutália Engrácia de Almeida, 142 – Tupi, Belo Horizonte – MG, 31844-170
            </div>
            <div className="flex gap-2 shrink-0">
              <a className="inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-white border border-white/20"
                 target="_blank" rel="noreferrer"
                 href="https://www.google.com/maps?q=Rua+Eut%C3%A1lia+Engr%C3%A1cia+de+Almeida,+142+-+Tupi,+Belo+Horizonte+-+MG,+31844-170">
                Abrir no Google Maps
              </a>
              <a className="inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-white border border-white/20"
                 target="_blank" rel="noreferrer"
                 href="https://waze.com/ul?q=Rua%20Eut%C3%A1lia%20Engr%C3%A1cia%20de%20Almeida%2C%20142%20-%20Tupi%2C%20Belo%20Horizonte%20-%20MG%2C%2031844-170">
                Abrir no Waze
              </a>
            </div>
          </div>

          <div className="card overflow-hidden mt-6 mb-6">
            <iframe
              title="Mapa IBAC"
              className="w-full h-[420px] border-0"
              loading="lazy"
              src="https://www.google.com/maps?q=Rua+Eut%C3%A1lia+Engr%C3%A1cia+de+Almeida,+142+-+Tupi,+Belo+Horizonte+-+MG,+31844-170&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
