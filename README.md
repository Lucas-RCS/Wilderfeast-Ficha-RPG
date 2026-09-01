# Wilderfeast — Fichas Digitais

Uma aplicação completa para gerenciamento de fichas do jogo **Wilderfeast**, oferecendo um hub centralizado para mestres e jogadores gerenciarem fichas de Ferais e fichas de Criaturas/Bestiário.

## 🎮 Sobre o Projeto

Wilderfeast é um aplicativo web SPA (Single Page Application) desenvolvido em **React 19** com **TypeScript** e **Vite**, oferecendo uma solução client-only para criação, edição e gerenciamento de fichas de personagens e criaturas do jogo Wilderfeast.

> **📌 Nota Importante:** Este é um projeto **independente feito por fã da comunidade**, criado com dedicação para facilitar a experiência de jogo. É um projeto **não oficial, sem fins comerciais e completamente gratuito**, desenvolvido de forma voluntária por entusiastas do jogo Wilderfeast.

**Características principais:**

- 📝 Criação e edição de Fichas de Feral (personagens jogáveis)
- 🐉 Gerenciamento de Fichas de Criaturas/Bestiário (para mestres)
- 💾 Autosave automático com localStorage
- ↩️ Sistema de Undo/Redo
- 🎨 Interface responsiva com Tailwind CSS
- ⚡ Carregamento rápido com otimização de bundle

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone <seu-repositório>
cd Wilderfeast-Ficha-RPG

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

| Comando           | Descrição                                       |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Inicia servidor de desenvolvimento (porta 3000) |
| `npm run build`   | Build otimizado para produção                   |
| `npm run preview` | Visualiza build local                           |
| `npm run clean`   | Remove pasta de build                           |
| `npm run lint`    | Verifica tipos TypeScript                       |

## 🛠️ Tech Stack

| Tecnologia   | Versão  | Uso                     |
| ------------ | ------- | ----------------------- |
| React        | 19.0.1  | Framework UI            |
| TypeScript   | ~5.8.2  | Type safety             |
| Vite         | 6.2.3   | Build tool & dev server |
| Tailwind CSS | 4.1.14  | Styling                 |
| Lucide React | 0.546.0 | Ícones                  |

## 💾 Persistência de Dados

O projeto utiliza **localStorage** para persistência de dados (sem backend). Todos os dados são salvos localmente no navegador do usuário.

- Fichas são armazenadas automaticamente com o hook `useAutosaveEntity`
- Histórico de edições gerenciado por `useUndoRedo`
- Para mais detalhes, veja [src/lib/storage.ts](src/lib/storage.ts)

## 🎯 Recursos Principais

### Hub Central

Página inicial com gerenciamento de todas as fichas criadas:

- Visualização de fichas salvas
- Criação de novas fichas
- Edição rápida
- Exclusão de fichas

### Criação de Fichas

- **Feral** — Fichas de personagens jogáveis com assistente passo-a-passo
- **Criatura** — Fichas de bestiário para mestres

### Editor de Fichas

- Edição completa de atributos
- Gerenciamento de características e condições
- Previsualização em tempo real
- Autosave automático

## 🔧 Desenvolvimento

### TypeScript

O projeto usa TypeScript para type safety. Para verificar tipos:

```bash
npm run lint
```

### Tailwind CSS

Estilos são gerenciados com Tailwind CSS v4. Configuração em `tailwind.config.js` (se existente).

### Vite

Configurado em `vite.config.ts` com:

- Plugin React
- Tailwind CSS Vite plugin
- Otimizações de bundle

## 🐛 Troubleshooting

### Erro: Muitos erros TypeScript (4000+)

**Solução:** Verifique se `@types/react` e `@types/react-dom` estão instalados:

```bash
npm install --save-dev @types/react @types/react-dom
npm run lint
```
