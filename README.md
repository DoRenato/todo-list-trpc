# TODO List com tRPC

Uma aplicação de lista de tarefas construída com Next.js e tRPC.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 16.1.6** - Framework React com renderização server-side
- **React 19.2.3** - Biblioteca principal de UI
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS 4** - Framework de estilização utility-first
- **Shadcn/ui** - Componentes UI reutilizáveis e acessíveis
- **React Hook Form** - Gerenciamento de formulários com validação
- **Zod** - Validação de dados e tipagem
- **Lucide React** - Ícones modernos

### Backend & API
- **tRPC 11.12.0** - API type-safe com validação automática
- **React Query (@tanstack/react-query)** - Cache e gerenciamento de estado de servidor
- **SuperJSON** - Serialização avançada para tipos complexos

## 🏗️ Arquitetura e Estratégias

### 1. **Arquitetura Monolítica com tRPC**
O projeto utiliza uma arquitetura onde frontend e backend estão no mesmo projeto Next.js, mas com separação clara de responsabilidades através do tRPC.

### 2. **Estrutura de Pastas**
```
├── app/              # Páginas e layout Next.js
├── components/       # Componentes React reutilizáveis
├── lib/
│   ├── trpc/        # Configuração e routers tRPC
│   ├── data/        # Camada de dados (simulação de banco)
├── features/        # Funcionalidades específicas
└── widgets/         # Componentes de UI independentes
```

### 3. **Camada de Dados**
- **Armazenamento em memória**: Simulação de banco de dados usando array
- **CRUD completo**: Criar, Ler, Atualizar e Deletar tarefas
- **Paginação**: Implementação de cursor-based pagination
- **Ordenação**: Tarefas ordenadas por data de criação (mais recentes primeiro)

### 4. **Estratégia de Paginação Infinita**
- **Cursor-based pagination**: Mais eficiente que offset-based
- **Intersection Observer API**: Detecta quando o usuário chega ao final da lista
- **React Query**: Gerencia cache e estados de loading/error
- **Server-side initial data**: Primeira carga renderizada no servidor

### 5. **Validação e Type Safety**
- **Zod schemas**: Validação de entrada em todas as procedures tRPC
- **Type inference**: Tipos automaticamente derivados dos schemas
- **Error handling**: Padronização de erros com TRPCError

### 6. **UI/UX Patterns**
- **Component-driven development**: Componentes reutilizáveis e testáveis
- **Loading states**: Feedback visual durante operações assíncronas
- **Toast notifications**: Feedback não-intrusivo para ações do usuário

## 📋 Funcionalidades

### ✅ Core Features
- **Listar tarefas** com paginação infinita
- **Criar novas tarefas** com título e descrição
- **Editar tarefas** existentes
- **Deletar tarefas** com confirmação
- **Busca por ID** para edição

### 🎨 UI Features
- **Design moderno** com Tailwind CSS e Shadcn/ui
- **Smooth animations** e transições
- **Loading skeletons** durante carregamento

## 🏃‍♂️ Como Usar a Aplicação

1. **Visualizar tarefas**: A página inicial mostra as 5 tarefas mais recentes
2. **Carregar mais**: Role até o final para carregar mais tarefas automaticamente
3. **Criar tarefa**: Clique em "Nova tarefa" no menu superior
4. **Editar tarefa**: Clique no ícone de lápis na tarefa desejada
5. **Deletar tarefa**: Clique no ícone de lixeira para remover

## 🔧 Conceitos Chave Demonstrados

### tRPC Procedures
```typescript
// Query para buscar dados (não altera estado)
list: publicProcedure
  .input(z.object({ limit: z.number() }))
  .query(({ input }) => getTasks(input.limit))

// Mutation para alterar dados
create: publicProcedure
  .input(z.object({ titulo: z.string() }))
  .mutation(({ input }) => createTask(input.titulo))
```

### React Query Integration
```typescript
const { data, fetchNextPage, hasNextPage } = trpc.task.list.useInfiniteQuery(
  { limit: 5 },
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: { pages: [initialData], pageParams: [undefined] },
  }
);
```

### Server-side Rendering
```typescript
// Dados iniciais carregados no servidor
export default async function HomePage() {
  const initialTasks = await trpcServer.task.list({ limit: 5 });
  return <TaskListInfinite initialData={initialTasks} />;
}
```

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- npm, yarn, pnpm ou bun

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd todo-list-trpc
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

4. **Abra no navegador**
Acesse [http://localhost:3000](http://localhost:3000)

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código com ESLint
