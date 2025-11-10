export default function Contacts() {
  return (
    <div className="container-limit py-10">
      <h1 className="text-3xl font-extrabold text-center mb-2">Nossos Contatos</h1>
      <p className="text-center text-gray-600 mb-6">Entre em contato conosco</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-2xl">📧</div>
          <div className="font-semibold mt-2">Email</div>
          <div className="text-gray-600">contato@ibac.org.br</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl">📸</div>
          <div className="font-semibold mt-2">Instagram</div>
          <div className="text-gray-600">@ibac_23</div>
        </div>
      </div>

      <div className="text-center mt-6">
        <a href="/login" className="btn">Cadastro Inicial - Administração</a>
      </div>
    </div>
  )
}
