# Simple Tasks API

API simples para gerenciamento de tarefas, feita com Fastify, Prisma e PostgreSQL.

- Código principal: [`src/server.ts`](src/server.ts)
- Gerenciador de pacotes: [`package.json`](package.json)

## Visão geral

- Autenticação por JWT (plugin [`@fastify/jwt`](src/server.ts)).
- Endpoints públicos para registro/login e privados para CRUD de tarefas.
- Banco de dados gerenciado por Prisma (schema: [`prisma/schema.prisma`](prisma/schema.prisma)).
- Documentação das rotas: Swagger e UI via [`@scalar/fastify-api-reference`](src/server.ts), acessível em `/docs`.
- Container PostgreSQL de exemplo em [`docker-compose.yml`](docker-compose.yml).

## Principais arquivos e responsabilidades

- Servidor e configuração
  - [`src/server.ts`](src/server.ts): inicializa o app, plugins, rotas e documentação.
  - [`package.json`](package.json): script de desenvolvimento `pnpm dev`.

- Rotas
  - Autenticação
    - [`RegisterUserRoute`](src/routes/auth/registerRoute.ts): cria usuário.
    - [`LoginUserRoute`](src/routes/auth/loginRoute.ts): autentica e gera token JWT.
  - Tarefas (protegidas por token)
    - [`GetTasksRoute`](src/routes/tasks/getTasksRoute.ts): listagem paginada.
    - [`GetTaskByIdRoute`](src/routes/tasks/getTaskById.ts): detalhes por id.
    - [`CreateTaskRoute`](src/routes/tasks/createTaskRoute.ts): cria nova tarefa.
    - [`UpdateTaskRoute`](src/routes/tasks/updateTaskRoute.ts): atualiza tarefa (PATCH).
    - [`DeleteTaskRoute`](src/routes/tasks/deleteTaskRoute.ts): deleta tarefa.

- Autenticação
  - Middleware [`AuthHandler`](src/middlewares/AuthHandler.ts): valida JWT e adiciona `getCurrentUserToken()` à request.
  - Type augmentation em [`src/@types/fastify.d.ts`](src/@types/fastify.d.ts).

- Prisma
  - Cliente: [`src/prisma/client.ts`](src/prisma/client.ts).
  - Schema: [`prisma/schema.prisma`](prisma/schema.prisma).
  - Migrações: [`prisma/migrations/`](prisma/migrations/) (ex.: `20251126183725_create_database`).

## Variáveis de ambiente

Crie um `.env` com, no mínimo:

- DATABASE_URL=postgresql://simpleadmin:admin@localhost:5432/simplestasks_app
- JWT_SECRET=algum_segredo_super_secreto
- PORT=3000 (opcional)

As variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` também estão configuradas no [`docker-compose.yml`](docker-compose.yml) para o container Postgres.

## Requisitos

- Node >= 18
- pnpm (recomendado) ou npm
- Docker (opcional, para rodar o banco)

## Como rodar local (desenvolvimento)

1. Instale dependências:
   - pnpm: `pnpm install`

2. Configure o banco:
   - Usando Docker: `docker compose up -d` (ou `docker-compose up -d`) para subir a instância Postgres a partir de [`docker-compose.yml`](docker-compose.yml).

3. Gere cliente Prisma e aplique migrações:
   - `pnpm prisma generate`
   - `pnpm prisma migrate deploy` (ou `pnpm prisma migrate dev --name init` em dev)

4. Crie `.env` com `DATABASE_URL`, `JWT_SECRET`, `PORT` (ver seção acima).

5. Rode a aplicação:
   - `pnpm dev` — inicia com `tsx` (watch).

6. Acesse:
   - API: http://localhost:3000
   - Docs: http://localhost:3000/docs

## Observações e boas práticas

- A autenticação depende de `JWT_SECRET` em [`src/server.ts`](src/server.ts).
- O middleware [`AuthHandler`](src/middlewares/AuthHandler.ts) utiliza `request.jwtVerify()` para validar o token e expõe a função `getCurrentUserToken()` definida em [`src/@types/fastify.d.ts`](src/@types/fastify.d.ts).
- O cliente Prisma é gerado em [`src/generated/prisma`](src/generated/prisma) (gerenciado por `.gitignore`) e é importado em [`src/prisma/client.ts`](src/prisma/client.ts).
- As rotas usam validação com Zod via [`fastify-type-provider-zod`](src/server.ts).

## Contribuindo

- Mantenha migrações no diretório `prisma/migrations`.
- Ao alterar o schema, rode `pnpm prisma migrate dev` e `pnpm prisma generate`.

---