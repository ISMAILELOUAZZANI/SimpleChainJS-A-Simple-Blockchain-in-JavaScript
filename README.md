# SimpleChainJS: A Simple Blockchain in JavaScript

## Project Overview

SimpleChainJS is a minimal blockchain built in Node.js, designed for learning and certification projects. It demonstrates the fundamental principles of blockchain: blocks, proof-of-work, transactions, and exposes a simple REST API.

## Features

- Add new transactions
- Mine blocks (Proof of Work)
- View the full blockchain
- Simple REST API with Express.js

## Requirements

- Node.js >= 14
- npm

## Installation

```bash
npm install
```

## Running the Project

```bash
node simplechain.js
```

The server will start on `http://localhost:3000/`

## API Endpoints

- `GET /chain` - Get the entire blockchain
- `POST /transactions/new` - Add a new transaction
- `GET /mine` - Mine a new block

## Example Usage

1. Add a transaction:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"sender":"alice","recipient":"bob","amount":10}' \
  http://localhost:3000/transactions/new
```

2. Mine a block:

```bash
curl http://localhost:3000/mine
```

3. View the chain:

```bash
curl http://localhost:3000/chain
```