# API de Controle Financeiro Pessoal

API RESTful desenvolvida com **NestJS** e **MongoDB** (utilizando `@nestjs/mongoose` e MongoDB Atlas), criada como motor de um aplicativo de Controle Financeiro Pessoal com viés extensionista alinhado aos **ODS 1** (Erradicação da Pobreza) e **ODS 12** (Consumo e Produção Responsáveis).

---

## Funcionalidades

- **Cadastro de Transações (`POST /transacoes`)**: Registra receitas e despesas com indicador de consumo consciente.
- **Histórico e Métricas (`GET /transacoes`)**: Retorna o histórico de todas as transações cadastradas e um resumo consolidado processado no Service:
  - `saldoTotal`: Soma das receitas menos as despesas.
  - `totalDespesas`: Soma de todas as despesas.
  - `totalGastoImpulso`: Soma das despesas que não foram essenciais (`consumoConsciente: false`).

---

## Modelo de Dados (Schema Transacao)

| Campo | Tipo | Descrição |
|---|---|---|
| `descricao` | String | Nome ou descrição da transação (ex: "Conta de Luz", "Salário") |
| `valor` | Number | Valor monetário positivo |
| `tipo` | String | Apenas `"receita"` ou `"despesa"` |
| `categoria` | String | Categoria do gasto/receita (ex: "Moradia", "Lazer", "Trabalho") |
| `consumoConsciente` | Boolean | `true` se foi essencial; `false` se foi gasto por impulso |

---

## Rotas da API

### 1. Criar Transação
- **Método**: `POST`
- **Rota**: `/transacoes`
- **Body (JSON)**:
```json
{
  "descricao": "Conta de Luz",
  "valor": 150.00,
  "tipo": "despesa",
  "categoria": "Moradia",
  "consumoConsciente": true
}
```

### 2. Obter Histórico e Métricas
- **Método**: `GET`
- **Rota**: `/transacoes`
- **Resposta (JSON)**:
```json
{
  "historico": [
    {
      "_id": "6724...",
      "descricao": "Salário",
      "valor": 3000.00,
      "tipo": "receita",
      "categoria": "Trabalho",
      "consumoConsciente": true,
      "createdAt": "2026-11-05T...",
      "updatedAt": "2026-11-05T..."
    },
    {
      "_id": "6725...",
      "descricao": "Compra de Roupas",
      "valor": 200.00,
      "tipo": "despesa",
      "categoria": "Lazer",
      "consumoConsciente": false,
      "createdAt": "2026-11-05T...",
      "updatedAt": "2026-11-05T..."
    }
  ],
  "metricas": {
    "saldoTotal": 2800.00,
    "totalDespesas": 200.00,
    "totalGastoImpulso": 200.00
  }
}
```

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js (v20 ou superior)
- Instância do MongoDB ou MongoDB Atlas

### 1. Instalação das dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/controle-financeiro?retryWrites=true&w=majority
```

### 3. Rodar a aplicação
```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

### 4. Executar os testes
```bash
# Testes unitários
npm test

# Testes ponta a ponta (e2e)
npm run test:e2e
```
