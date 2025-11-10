# IBAC – Igreja Batista Acolher em Cristo (MERN)

Site + API completos com autenticação JWT e Dashboard de voluntários.

## Estrutura
```
ibac-site/
  server/           -> API Node/Express + MongoDB (Mongoose)
  client/           -> Frontend React + Vite + Tailwind
```

## Passo a passo (dev)
1) Crie seu banco no MongoDB (Atlas ou local).
2) No diretório `server/`, crie um `.env` a partir de `.env.example` e preencha `MONGO_URI` e `JWT_SECRET`.
3) No `server/`:
```bash
npm install
npm run dev
```
A API sobe em `http://localhost:4000`.

4) No `client/`:
```bash
npm install
npm run dev
```
O site abre em `http://localhost:5173` (ou porta indicada).

### Login / Dashboard
- Acesse **Login / Cadastre-se** no rodapé/menu.
- Crie uma conta. Um admin pode atualizar o campo `role` do usuário para `volunteer`/`admin` diretamente no banco (ou use a rota `/api/auth/make-admin` conforme comentário no código se quiser habilitar).
- Somente `volunteer` e `admin` acessam o **Dashboard** (escalas, avisos, eventos).

### Observações
- O carrossel, mapa e layout seguem o visual enviado nas imagens.
- Tailwind já configurado.
- Rotas protegidas no frontend via `RequireAuth`.
- Dados básicos: Avisos, Eventos e Escalas.
```

## Deploy (resumo)
- Server: qualquer provedor Node (Railway/Render/Vercel Functions + Mongo Atlas).
- Client: Vercel/Netlify.
- Defina `VITE_API_URL` no `client/.env` apontando para o servidor.
```
VITE_API_URL=https://SUAS-API.com
```
