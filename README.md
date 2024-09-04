# Cash Flow Manager

## Descrição
O **Cash Flow Manager** é uma aplicação web de gerenciamento financeiro pessoal, desenvolvida para ajudar os usuários a controlar suas finanças de maneira eficiente. A aplicação oferece funcionalidades como o gerenciamento de transações, categorização de despesas, geração de relatórios financeiros, criação e acompanhamento de orçamentos, entre outros.

Este projeto é desenvolvido em uma stack JavaScript full stack, utilizando **Node.js** com **NestJS** no backend e **React** no frontend, com **PostgreSQL** como banco de dados.

## Funcionalidades Principais
- **Autenticação e Segurança**: Criação de contas, login, recuperação de senha e autenticação JWT.
- **Gerenciamento de Transações**: Registro, visualização, edição e exclusão de transações financeiras.
- **Categorização de Despesas**: Criação, edição e exclusão de categorias para organização das despesas.
- **Relatórios Financeiros**: Geração de gráficos e tabelas baseados em filtros personalizados.
- **Gerenciamento de Orçamentos**: Criação e acompanhamento de orçamentos mensais ou anuais.
- **Integração com APIs Externas**: Sincronização bancária, atualização de taxas de câmbio e importação de transações.
- **Customização do Sistema**: Preferências de usuário, notificações personalizadas e interface customizável.

## Tecnologias Utilizadas
- **Backend**:
  - Node.js
  - NestJS
  - TypeORM
  - PostgreSQL
- **Frontend**:
  - React
  - Vite
  - SCSS
- **Infraestrutura**:
  - Docker
  - Render (Deploy)
  - CI/CD com GitHub Actions

## Estrutura do Projeto
O projeto está dividido em duas partes principais:

- **Backend**: Localizado na pasta `backend/`, contém a API desenvolvida em Node.js com NestJS e TypeORM para o banco de dados.
- **Frontend**: Localizado na pasta `frontend/`, contém a aplicação React que consome a API e oferece a interface do usuário.

## Configuração e Instalação

### Pré-requisitos
- Node.js
- PostgreSQL
- Docker (opcional, para desenvolvimento em container)
- Git

### Passos para Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/cash-flow-manager.git
   cd cash-flow-manager
