# AgentFlow AI

SaaS multicanal para criação, treinamento, atendimento e gestão de agentes de IA. A base usa Next.js App Router, TypeScript, Tailwind CSS, Prisma e PostgreSQL, com respostas de IA mockadas quando não houver chaves configuradas.

## Instalação

```bash
npm install
cp .env.example .env
npm run db:generate
```

Configure `DATABASE_URL` no `.env` apontando para um PostgreSQL local.

## Banco de dados

```bash
npm run db:migrate
npm run db:seed
```

O seed cria o usuário Rafael, workspace "Meu Workspace", agente "Jéssica Helen", canal "Estúdio JH", contatos, mensagens e créditos iniciais.

## Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`. As rotas principais incluem `/dashboard`, `/agents`, `/channels`, `/chat`, `/contacts`, `/team`, `/more`, `/settings`, `/billing`, `/api-keys`, `/knowledge-base`, `/templates`, `/labels` e `/appointments`.

## Build

```bash
npm run build
```

## Integrações futuras

Os serviços em `src/services` deixam preparada a evolução para OpenAI, OpenRouter, Groq, Anthropic, Gemini, WhatsApp Meta oficial e WhatsApp Web via QR Code.
