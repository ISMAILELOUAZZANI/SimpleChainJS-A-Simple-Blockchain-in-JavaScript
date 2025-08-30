const express = require('express');
const crypto = require('crypto');

class Blockchain {
  constructor() {
    this.chain = [];
    this.currentTransactions = [];
    // Create genesis block
    this.newBlock(100, '1');
  }

  newBlock(proof, previousHash = null) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      proof: proof,
      previous_hash: previousHash || this.hash(this.chain[this.chain.length - 1])
    };
    this.currentTransactions = [];
    this.chain.push(block);
    return block;
  }

  newTransaction(sender, recipient, amount) {
    this.currentTransactions.push({
      sender,
      recipient,
      amount
    });
    return this.lastBlock()['index'] + 1;
  }

  lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  hash(block) {
    const blockString = JSON.stringify(block, Object.keys(block).sort());
    return crypto.createHash('sha256').update(blockString).digest('hex');
  }

  proofOfWork(lastProof) {
    let proof = 0;
    while (!this.validProof(lastProof, proof)) {
      proof++;
    }
    return proof;
  }

  validProof(lastProof, proof) {
    const guess = `${lastProof}${proof}`;
    const guessHash = crypto.createHash('sha256').update(guess).digest('hex');
    return guessHash.substr(0, 4) === '0000';
  }
}

// Setup Express app
const app = express();
const blockchain = new Blockchain();

app.use(express.json());

app.get('/chain', (req, res) => {
  res.json({
    chain: blockchain.chain,
    length: blockchain.chain.length
  });
});

app.post('/transactions/new', (req, res) => {
  const { sender, recipient, amount } = req.body;
  if (!sender || !recipient || typeof amount !== 'number') {
    return res.status(400).json({ message: 'Missing values' });
  }
  const index = blockchain.newTransaction(sender, recipient, amount);
  res.status(201).json({ message: `Transaction will be added to Block ${index}` });
});

app.get('/mine', (req, res) => {
  const lastBlock = blockchain.lastBlock();
  const lastProof = lastBlock.proof;
  const proof = blockchain.proofOfWork(lastProof);

  // Reward for mining
  blockchain.newTransaction("0", "miner-address", 1);

  const block = blockchain.newBlock(proof);

  res.json({
    message: "New Block Forged",
    index: block.index,
    transactions: block.transactions,
    proof: block.proof,
    previous_hash: block.previous_hash
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SimpleChainJS running at http://localhost:${PORT}`);
});