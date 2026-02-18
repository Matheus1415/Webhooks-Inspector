# 🚀 Webhook Inspector (AI-Powered)

O **Webhook Inspector** é uma estação de trabalho agnóstica para desenvolvedores que lidam com integrações. Ele permite capturar, inspecionar, editar e replicar webhooks de qualquer serviço (Stripe, Asaas, GitHub) em tempo real, eliminando o "vai e vem" de testes em produção.

---

## ✨ Funcionalidades

* **Captura Agnóstica:** Rota curinga (`/capture/*`) preparada para receber dados de qualquer provedor com mapeamento completo de Headers e Body.
* **Editor Monaco Integrado:** Visualize e edite payloads JSON com o mesmo motor do VS Code.
* **Smart Replay:** Envie novamente um webhook para seu ambiente local após editá-lo, sem precisar de um novo disparo do serviço original.
* **AI Code Generation:** Analisa o histórico de eventos e gera automaticamente **Schemas de validação Zod** e **Interfaces TypeScript**.
* **Exportação Rápida:** Gere comandos `cURL`, `Fetch` ou `Axios` com um clique.

---

## 🛠️ Tech Stack

### **Frontend**
* React + TypeScript
* Tailwind CSS
* Monaco Editor
* Lucide Icons

### **Backend**
* Fastify (Node.js)
* Drizzle ORM
* PostgreSQL
* Zod (Validation)
* Integração com LLM para geração de código

---

## 🚀 Como rodar o projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/webhook-inspector.git](https://github.com/Matheus1415/Webhooks-Inspector.git)
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Suba o banco de dados (Docker):**
    ```bash
    docker-compose up -d
    ```

4.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` seguindo o `.env.example` com suas credenciais do banco de dados e chave da API de IA.

5.  **Rode as migrações do banco:**
    ```bash
    npx drizzle-kit push
    ```
    
6.  **Rode as migrações do banco:**
    ```bash
    # Gera as migrações
    npm run db:generate
    
    # Aplica as migrações no banco
    npm run db:migrate
    
    # (Opcional) Popula o banco com dados iniciais
    npm run db:seed
    ```

7.  **Inicie o servidor e o front:**
    ```bash
    npm run dev
    ```

---

## 🧠 O Diferencial da IA

Diferente de ferramentas de inspeção comuns, o **Webhook Inspector** utiliza inteligência artificial para entender a semântica dos dados. Ao selecionar múltiplos eventos, a IA identifica o que é um campo opcional, o que é um Enum e gera um contrato de dados robusto, pronto para ser copiado e colado no seu projeto.
