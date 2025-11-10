import { useEffect, useState } from 'react';
import { createUser, getUser, updateUser } from '../../api/users';
import { useNavigate, useParams } from 'react-router-dom';

export default function MemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    position: '',
    birthDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isEdit) return;
      try {
        const u = await getUser(id);
        setForm({
          name: u.name || '',
          email: u.email || '',
          password: '',
          role: u.role || 'member',
          position: u.position || '',
          birthDate: u.birthDate ? new Date(u.birthDate).toISOString().slice(0, 10) : '',
        });
      } catch (e) {
        alert(e.message);
      }
    }
    load();
  }, [id, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.birthDate) delete payload.birthDate; // <-- corrigido

      if (isEdit) {
        if (!payload.password) delete payload.password;
        await updateUser(id, payload);
      } else {
        if (!payload.password) {
          alert('Informe uma senha.');
          setLoading(false);
          return;
        }
        await createUser(payload);
      }
      navigate('/membros');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-limit section-band">
      <h1 className="page-title text-2xl mb-4">{isEdit ? 'Editar membro' : 'Novo membro'}</h1>

      <form onSubmit={onSubmit} className="card grid gap-4 max-w-2xl">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input
            className="input-ibac"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            type="email"
            className="input-ibac"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Função (role)</label>
            <select
              className="input-ibac"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="member">member</option>
              <option value="volunteer">volunteer</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Cargo (display)</label>
            <input
              className="input-ibac"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="Ex.: 1º Secretário"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Data de nascimento</label>
            <input
              type="date"
              className="input-ibac"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm mb-1">Senha</label>
              <input
                type="password"
                className="input-ibac"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mín. 6 caracteres"
              />
            </div>
          )}
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm mb-1">Nova senha (opcional)</label>
            <input
              type="password"
              className="input-ibac"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Deixe em branco para manter"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button className="btn-gold px-4" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-outline-gold px-4">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
