import { FastifySwaggerOptions } from "@fastify/swagger";

export const openApiDocumentation: FastifySwaggerOptions = {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Webhooks Inspector API",
      version: "1.0.0",
      description: `
API REST para captura, armazenamento e inspeção de webhooks recebidos.

Esta API permite:

- 📥 Receber requisições HTTP (webhooks)
- 🔎 Inspecionar headers, query params e body
- 📊 Visualizar status code, content-type e tamanho do payload
- 🕒 Ordenação cronológica baseada em UUID v7
- 📄 Paginação baseada em cursor

---

## 🌍 Base URL

\`\`\`
http://localhost:3333
\`\`\`

---

## 📦 Paginação

A listagem de webhooks utiliza **cursor-based pagination**.

Parâmetros disponíveis:

- \`limit\` — número máximo de registros (1–100)
- \`cursor\` — UUID do último item retornado

---

## 📄 Formato de Resposta

Todas as respostas são retornadas em **JSON**.

Datas são retornadas no padrão **ISO 8601 (UTC)**.

---

## 🚨 Status Codes

- **200** — Requisição bem-sucedida  
- **400** — Erro de validação  
- **404** — Recurso não encontrado  
- **500** — Erro interno do servidor  

---

## 🔐 Autenticação

Atualmente esta API não requer autenticação.
(Pode ser expandida futuramente para suportar Bearer Token.)
## 👨‍💻 Sobre o Autor

Este projeto foi desenvolvido por **Matheus Pereira da Silva**.

- 🧠 Foco em Backend & Arquitetura
- ⚡ Node.js, Fastify, PostgreSQL, Drizzle ORM
- 📦 APIs REST modernas e escaláveis

🔗 GitHub: https://github.com/Matheus1415  
🔗 LinkedIn: https://www.linkedin.com/in/matheus-pereira-da-silva-298020286/

---
`,
      contact: {
        name: "Matheus Pereira da Silva",
        url: "https://github.com/Matheus1415",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },

    servers: [
      {
        url: "http://localhost:3333",
        description: "Local development",
      },
      {
        url: "https://api.seudominio.com",
        description: "Production",
      },
    ],

    tags: [
      {
        name: "Webhooks",
        description: "Operations related to webhook inspection and retrieval",
      },
      {
        name: "Health",
        description: "Application health check endpoints",
      },
    ],
  },
};
