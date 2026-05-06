# 🎯 CORE REQUIREMENTS

Build a monorepo project with the following:

## 1. Architecture

* Monorepo structure:

apps/
api/        → REST API (NestJS)
worker/     → background workers (BullMQ)

libs/
blockchain/
queue/
db/
reorg/
tx-engine/
metrics/

* Use clean modular architecture (DI, providers, modules)
* Use TypeScript

---

## 2. Blockchain Integration

* Use ethers.js v6
* Support MULTI-CHAIN configuration (Ethereum, BSC, Polygon)
* Implement provider factory using FallbackProvider with multiple RPCs

---

## 3. Indexer System

Implement BOTH:

### a. Polling indexer

* Cron job scans blockchain using getLogs
* Batch processing (500–2000 blocks)
* Uses Redis to store last processed block per chain
* Uses BullMQ queue for job distribution

### b. Realtime listener

* Use provider.on() to listen for events
* Push events into queue

### c. Hybrid model

* Realtime = fast
* Polling = reliability

---

## 4. Reorg Handling (CRITICAL)

Implement REAL reorg-safe logic:

* Store block metadata:
  blockNumber, blockHash, parentHash

* Detect reorg:
  compare stored block hash vs parentHash

* On reorg:

  * rollback events from affected blocks
  * revert business state (orders)
  * reset block pointer

* Support deep reorg (not just last 5 blocks)

---

## 5. Database

* Use MongoDB with Mongoose

Schemas:

* Event:
  chainId + txHash + logIndex (unique index)

* Block:
  chainId + blockNumber

* Order:
  user, amount, status, txHash

* Use bulkWrite for inserts (no N+1 queries)

* Add TTL index for old events

---

## 6. Queue System

* Use BullMQ
* Separate producers (API / indexer) and consumers (worker)
* Configure concurrency (>= 10)
* Implement retry with exponential backoff

---

## 7. Transaction Engine (VERY IMPORTANT)

Implement production-grade tx engine:

* Nonce manager using Redis (atomic lock)
* Prevent nonce race condition
* Gas strategy (EIP-1559, dynamic bumping)
* Retry mechanism (at least 5 retries)
* Handle:

  * nonce too low
  * replacement underpriced
  * stuck transactions

---

## 8. Authentication (Web3)

* Implement SIWE (Sign-In With Ethereum)
* Endpoints:

POST /auth/nonce
POST /auth/verify

* Verify signature using siwe library

---

## 9. API Layer

* Basic Order API:

POST /orders
GET /orders

* Orders are linked to blockchain events

---

## 10. Metrics & Monitoring

* Use prom-client
* Expose:

GET /metrics

* Metrics:

  * jobs processed
  * RPC errors
  * tx failures

---

## 11. Deployment

* Provide:

docker-compose.yml
Dockerfile

* Services:

  * api
  * worker
  * redis
  * mongo

* Must run with:

docker compose up --build

---

## 12. Code Quality

* Use proper NestJS module structure
* No pseudo-code
* No placeholders like "TODO"
* No missing imports
* All files must be complete

---

# 🚨 IMPORTANT

* DO NOT simplify logic
* DO NOT skip reorg handling
* DO NOT skip tx engine
* DO NOT output explanations

ONLY output FULL CODE with file paths like:

/apps/api/src/main.ts
/libs/blockchain/provider.ts

---

# OUTPUT FORMAT

* Provide full project file tree
* Then provide each file with path and content
* Code must be copy-paste runnable

---

# 🔥 FINAL FLOW (UPDATED)
1. User → POST /orders
        ↓
   orderId = 65f...

2. Frontend:
   deposit(orderId)

3. Contract:
   emit Deposit(user, amount, orderId)

4. Indexer:
   detect log

5. Worker:
   decode → orderId

6. DB:
   update order EXACTLY