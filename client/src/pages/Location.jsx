export default function Location() {
  // endereço e links (pode editar se mudar)
  const addressText =
    "Rua Eutália Engrácia de Almeida, 142 - Tupi, Belo Horizonte - MG, 31844-170";

  const googleLink =
    "https://www.google.com/maps/place/Rua+Eut%C3%A1lia+Engr%C3%A1cia+de+Almeida,+142+-+Tupi,+Belo+Horizonte+-+MG,+31844-170";

  // coordenadas aproximadas do número 142 (para o Waze)
  const wazeLink =
    "https://waze.com/ul?ll=-19.809700,-43.946200&navigate=yes";

  // iframe do Google Maps com pin no endereço
  const embedSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.742993725654!2d-43.9488589240305!3d-19.809700829948024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa69a0fe7a7c8b1%3A0x3a9f0f6c0f6cba99!2sR.%20Eut%C3%A1lia%20Engr%C3%A1cia%20de%20Almeida%2C%20142%20-%20Tupi%2C%20Belo%20Horizonte%20-%20MG%2C%2031844-170!5e0!3m2!1spt-BR!2sBR!4v1700000000000";

  return (
    <div className="container-limit py-10">
      <h1 className="text-3xl font-extrabold text-center mb-2">Nossa Localização</h1>
      <p className="text-center text-gray-600 mb-6">Venha nos visitar</p>

      <div className="card p-0 overflow-hidden">
        {/* BARRA ROXA IGUAL À IMAGEM */}
        <div className="bg-ibac-accent text-white px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="font-semibold leading-snug">{addressText}</div>
          <div className="flex gap-2 shrink-0">
            <a
              className="btn bg-white text-ibac-accent hover:opacity-90"
              target="_blank"
              rel="noreferrer"
              href={googleLink}
            >
              Abrir no Google Maps
            </a>
            <a
              className="btn bg-white text-ibac-accent hover:opacity-90"
              target="_blank"
              rel="noreferrer"
              href={wazeLink}
            >
              Abrir no Waze
            </a>
          </div>
        </div>

        {/* MAPA EMBUTIDO COM PIN */}
        <div className="w-full h-[440px] md:h-[520px]">
          <iframe
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={embedSrc}
            title="Mapa IBAC"
          />
        </div>
      </div>
    </div>
  );
}
