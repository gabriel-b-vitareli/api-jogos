<div align="center">

# API Jogos

API REST para gerenciar o catálogo de uma loja de jogos, feita com **Node.js**, **Express** e **MongoDB**.

[![Abrir no Render](https://img.shields.io/badge/Abrir%20no-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://api-jogos-kquh.onrender.com/jogos)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## Sobre o projeto

Esta API implementa um **CRUD completo** (criar, listar, buscar, atualizar e deletar) para uma coleção de jogos. Os dados ficam salvos em um banco MongoDB, no banco `loja`, dentro da coleção `jogos`.

O projeto inteiro cabe em um único arquivo (`index.js`), o que facilita bastante entender o fluxo de uma API do zero.

## Tecnologias

| Tecnologia | Para que serve |
| --- | --- |
| [Node.js](https://nodejs.org) | Ambiente que executa o JavaScript no servidor |
| [Express 5](https://expressjs.com) | Framework que cria as rotas HTTP |
| [MongoDB Driver](https://www.mongodb.com/docs/drivers/node/current/) | Conecta a API ao banco de dados |
| [Render](https://render.com) | Hospedagem da API |

## Endpoints

URL base: `https://api-jogos-kquh.onrender.com`

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/jogos` | Cadastra um novo jogo |
| `GET` | `/jogos` | Lista todos os jogos |
| `GET` | `/jogos/:id` | Busca um jogo pelo `_id` |
| `PUT` | `/jogos/:id` | Atualiza campos de um jogo |
| `DELETE` | `/jogos/:id` | Remove um jogo |

### Exemplos de uso

**Cadastrar um jogo**

```bash
curl -X POST https://api-jogos-kquh.onrender.com/jogos \
  -H "Content-Type: application/json" \
  -d '{"nome": "Hollow Knight", "preco": 46.99, "plataforma": "PC"}'
```

**Listar todos**

```bash
curl https://api-jogos-kquh.onrender.com/jogos
```

**Buscar por id**

```bash
curl https://api-jogos-kquh.onrender.com/jogos/64f1a2b3c4d5e6f7a8b9c0d1
```

**Atualizar**

```bash
curl -X PUT https://api-jogos-kquh.onrender.com/jogos/64f1a2b3c4d5e6f7a8b9c0d1 \
  -H "Content-Type: application/json" \
  -d '{"preco": 39.99}'
```

**Deletar**

```bash
curl -X DELETE https://api-jogos-kquh.onrender.com/jogos/64f1a2b3c4d5e6f7a8b9c0d1
```

> Os campos do corpo da requisição são livres, já que o MongoDB não exige um schema fixo. Os exemplos acima usam `nome`, `preco` e `plataforma`, mas você pode usar os campos que quiser.

## Como o código funciona

### 1. Importações e configuração

```js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
```

O `express.json()` é um middleware que lê o corpo das requisições em JSON e o disponibiliza em `req.body`. Sem ele, o `POST` e o `PUT` não receberiam nenhum dado.

O `ObjectId` é necessário porque o MongoDB guarda o `_id` como um tipo especial, e não como texto comum.

### 2. Conexão com o banco

```js
const client = new MongoClient(process.env.MONGO_URI);
const produtos = client.db('loja').collection('jogos');
```

A string de conexão vem da variável de ambiente `MONGO_URI`, então nenhuma senha fica exposta no código. Depois, a API seleciona o banco `loja` e a coleção `jogos`, que é onde todas as rotas vão trabalhar.

### 3. As rotas

Cada rota usa um método do MongoDB:

| Rota | Método do MongoDB | Retorno |
| --- | --- | --- |
| `POST /jogos` | `insertOne(req.body)` | Status `201` com o resultado da inserção |
| `GET /jogos` | `find().toArray()` | Lista com todos os documentos |
| `GET /jogos/:id` | `findOne({ _id })` | O documento encontrado |
| `PUT /jogos/:id` | `updateOne({ _id }, { $set })` | Resultado da atualização |
| `DELETE /jogos/:id` | `deleteOne({ _id })` | Resultado da remoção |

No `PUT`, o operador `$set` altera **somente os campos enviados**, sem apagar o resto do documento. Por isso dá para mandar só o `preco`, por exemplo.

### 4. Inicialização do servidor

```js
client.connect()
  .then(() => {
    console.log('CONECTADO AO MONGODB');
    app.listen(PORT, () => console.log(`API RODANDO NA PORTA ${PORT}`));
  })
  .catch((erro) => console.log('ERRO AO CONECTAR', erro.message));
```

O servidor só começa a escutar requisições **depois** que a conexão com o banco foi estabelecida. Assim a API nunca recebe uma chamada sem ter onde salvar os dados.

A porta vem de `process.env.PORT`, que o Render define sozinho. Localmente, o padrão é `3000`.

## Rodando localmente

**Pré-requisitos:** Node.js 18 ou superior e um banco MongoDB (pode ser um cluster gratuito do [MongoDB Atlas](https://www.mongodb.com/atlas)).

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd API-Jogos

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env na raiz
echo "MONGO_URI=sua_string_de_conexao" > .env

# 4. Inicie a API
node --env-file=.env index.js
```

A API vai estar disponível em `http://localhost:3000/jogos`.

> A flag `--env-file` exige Node 20.6 ou superior. Em versões anteriores, instale o pacote `dotenv` e adicione `require('dotenv').config()` no topo do `index.js`.

## Deploy no Render

| Configuração | Valor |
| --- | --- |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Variável de ambiente** | `MONGO_URI` com a string de conexão do banco |

Se o banco for o MongoDB Atlas, lembre de liberar o acesso em **Network Access**. Como o Render não oferece IP fixo no plano gratuito, a opção mais simples é permitir `0.0.0.0/0`.

> **Aviso:** no plano gratuito, o Render coloca o serviço para dormir após um período sem uso. A primeira requisição depois disso pode levar cerca de um minuto para responder.

## Estrutura do projeto

```
API-Jogos/
├── index.js        # Servidor, conexão e rotas
├── package.json    # Dependências e metadados
├── .gitignore      # Ignora .env e node_modules
└── .env            # Variáveis de ambiente (não vai pro Git)
```

## Próximos passos

Ideias para evoluir o projeto:

- Tratar erros com `try/catch` nas rotas (hoje um `id` inválido derruba a requisição com erro 500)
- Validar os dados recebidos antes de salvar, com Zod ou Joi
- Retornar `404` quando o jogo não for encontrado
- Separar rotas e conexão em arquivos diferentes
- Adicionar paginação e filtros na listagem
- Liberar o acesso de outros domínios com `cors`

---

<div align="center">

Feito para fins de estudo.

</div>