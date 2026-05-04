# RWA_DEMO

                    ┌──────────────┐
                    │   Frontend   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   API Layer  │ (NestJS)
                    └──────┬───────┘
                           ↓
              ┌────────────────────────┐
              │   Business Services    │
              │ (Order, Asset, Auth)   │
              └──────┬─────────────────┘
                     ↓
         ┌─────────────────────────────┐
         │ PostgreSQL (source of truth)|
         └──────┬──────────────────────┘
                ↓
         ┌──────────────┐
         │    Redis     │
         └──────┬───────┘
                ↓
         ┌─────────────────────────────┐
         │       Queue (BullMQ)        │
         └──────┬──────────────────────┘
                ↓
      ┌───────────────────────────────┐
      │     Worker Cluster (Tx)       │
      └──────────┬────────────────────┘
                 ↓
          ┌──────────────┐
          │ Blockchain   │
          └──────┬───────┘
                 ↓
      ┌───────────────────────────────┐
      │     Indexer Service          │
      └──────────┬────────────────────┘
                 ↓
          ┌──────────────┐
          │ PostgreSQL   │ (sync state)
          └──────────────┘

## BACKEND STRUCTURE

rwa-backend/
├── src/
│ ├── main.ts
│ ├── app.module.ts
│
│ ├──modules/
│    ├── order/        
│    ├── auth/        
│    ├── blockchain/        
│    ├── tx/
│ ├── indexer.ts
│
├── docker-compose.yml
├── .env
├── package.json
