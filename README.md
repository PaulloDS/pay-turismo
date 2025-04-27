# PAYLINK - Gestão de Agências de Turismo

Este é um projeto completo de **Gestão de Agências de Turismo** composto por uma **API RESTful** desenvolvida com **Node.js (Express)**, **TypeScript**, **MySQL** e **Docker**, e um **Frontend** desenvolvido com **React.js** e **Tailwind CSS**. O sistema é projetado para permitir a gestão de agências de turismo, oferecendo funcionalidades de registro, login, CRUD (criar, ler, atualizar, excluir) para agências e recursos de autenticação via **JWT**.

## Funcionalidades

### API (Backend)
A API oferece rotas para a gestão de agências de turismo e autenticação de usuários. Ela está dividida em duas seções principais:

#### **Rotas de Administração**
- **GET /agency/**: Retorna uma lista de todas as agências.
- **POST /agency/**: Adiciona uma nova agência.
- **GET /agency/{id}/**: Exibe os detalhes de uma agência específica.
- **PUT /agency/{id}/**: Atualiza as informações de uma agência.
- **DELETE /agency/{id}/**: Remove uma agência do banco de dados (somente administradores).

#### **Rotas Públicas**
- **POST /register/**: Cria um novo analista ou administrador.
- **POST /login/**: Realiza o login de um analista ou administrador, retornando um JWT.

#### **Filtragem e Pesquisa**
- **GET /agency/** com parâmetros de consulta:
  - `?status={status}`: Filtra as agências por status (e.g., `aprovado`).
  - `?search={nome}`: Realiza uma busca por nome ou habilidades específicas.

#### **Autenticação e Autorização**
- Implementação de autenticação utilizando **JWT**. Apenas usuários autenticados podem acessar rotas protegidas. Somente administradores podem excluir agências.

#### **Documentação da API**
- A documentação da API foi gerada utilizando **Swagger**, acessível no caminho `/docs` após o deployment.

### Frontend (Interface de Usuário)
A interface foi construída com **React.js** e **Tailwind CSS**, com uma arquitetura de componentes reutilizáveis e responsivos. A aplicação oferece as seguintes telas e funcionalidades:

#### **Tela de Registro**
- Formulário para registro de novos usuários, incluindo campos como e-mail, senha e cargo.
- Redirecionamento para a tela de login após o registro bem-sucedido.

#### **Tela de Login**
- Formulário de login com autenticação via **JWT**.
- Redirecionamento para a lista de agências após o login bem-sucedido.

#### **Tela de Lista de Agências**
- Exibe uma lista de agências com informações como nome fantasia, CNPJ, inscrição estadual, status e data de fundação.
- Funcionalidade de filtragem por status e busca por nome ou data.

#### **Tela de Detalhes da Agência**
- Exibição detalhada das informações de uma agência.
- Opção para editar as informações da agência.

#### **Formulário de Adição/Edição de Agências**
- Permite a adição de novas agências ou a edição das existentes, com campos como nome fantasia, CNPJ, inscrição estadual, status e data de fundação.

#### **Confirmação de Exclusão**
- Para analistas e administradores, a exclusão de uma agência requer uma confirmação.

#### **Design Responsivo**
- A aplicação é completamente responsiva, adaptando-se a dispositivos móveis e desktops.

#### **Componentização e UX**
- A estrutura foi organizada com componentes reutilizáveis, e a experiência do usuário foi priorizada para garantir um fluxo de navegação intuitivo e agradável.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, TypeScript, MySQL, JWT, Swagger (documentação), Docker.
- **Frontend**: React.js, Tailwind CSS, Shadcn/ui.
- **Testes**: Jest (para testes unitários da API).
- **Docker Compose**: Para orquestrar os containers do ambiente de desenvolvimento.
