# Plataforma de Revisão Inteligente por Matérias
— Front-end

Interface web responsável pela experiência do usuário da Plataforma de Revisão Inteligente por Matérias. Permite que alunos organizem seus estudos e que professores acompanhem o engajamento acadêmico por meio de uma interface moderna, reativa e segura.

---

## 🎯 Visão do Produto

A aplicação oferece uma experiência intuitiva para:

- 📚 Organização de disciplinas
- 📝 Registro de tópicos estudados
- 🔁 Revisões com reflexão em texto livre
- 📅 Lista priorizada "Estudar Hoje"
- 📊 Visualização de histórico de revisões
- 👩‍🏫 Dashboard pedagógico para acompanhamento da turma

A interface foi projetada para ser simples, rápida e orientada à produtividade acadêmica.

---

## 🏗 Papel do Front-end na Arquitetura

A aplicação Angular atua como cliente da API REST desenvolvida em FastAPI.

**Fluxo da aplicação:**
```
Usuário → Angular → API (FastAPI) → Banco de Dados (MySQL)
```

Responsabilidades do front-end:

- Consumir a API via HTTP
- Gerenciar autenticação baseada em JWT
- Controlar navegação e proteção de rotas
- Apresentar dados estruturados ao usuário
- Tratar erros de autorização automaticamente

---

## 🧱 Stack Tecnológica

| Tecnologia | Descrição |
|---|---|
| Angular | Framework principal |
| TypeScript | Tipagem estática |
| RxJS | Programação reativa |
| Angular Router | Navegação e guards |
| HttpClient | Comunicação com API |
| Interceptors | Injeção automática de token |
| SCSS | Estilização |

---

## 🔐 Autenticação

A autenticação é baseada em JWT com as seguintes características:

- 🔑 Token armazenado no `localStorage`
- 🔁 Interceptor injeta automaticamente `Authorization: Bearer <token>` em todas as requisições
- 🚪 Logout automático em caso de resposta `401`
- 🛡 Tratamento de erro `403` (acesso negado)
- ⚙ Compatível com SSR via `isPlatformBrowser`

### Fluxo de Login

1. Usuário envia credenciais
2. API retorna `access_token`
3. Token é armazenado no navegador
4. Interceptor adiciona o token às próximas requisições
5. Rotas protegidas exigem autenticação válida

---

## 📁 Estrutura do Projeto
```
src/
├── app/
│   ├── config/       → configurações globais
│   ├── env/          → configuração da URL da API
│   ├── models/       → tipagem e contratos
│   ├── pages/        → telas da aplicação
│   ├── routes/       → configuração de navegação
│   └── services/     → comunicação com a API
├── index.html
└── main.ts
```

---

## 🔗 Integração com a API

A base URL da API é definida em `environment.apiUrl`:
```
http://localhost:8000
```

Todas as requisições utilizam `HttpClient` com interceptor para envio automático do token JWT.

---

## ⚙️ Execução Local

### 1. Clonar o repositório
```bash
git clone https://github.com/cauagms/plataforma-revisao-front.git
cd plataforma-revisao-front
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Executar a aplicação
```bash
ng serve
```

Aplicação disponível em: **http://localhost:4200**

---

## 📌 Considerações Técnicas

- Arquitetura modular organizada por domínio
- Separação clara entre camada de apresentação e serviços
- Integração segura com API via JWT
- Código totalmente tipado com TypeScript
- Estrutura preparada para expansão de dashboards e métricas visuais
