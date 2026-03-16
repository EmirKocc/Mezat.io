# Architecture Notes (MVP)

## Assumptions
- MVP backend uses in-memory repository for rapid iteration.
- MongoDB init script is prepared in `infrastructure/mongodb/init.js`.
- Redis is provisioned in Docker for realtime state and pub/sub in next iteration.

## Module Boundaries
- `auth`: email/password + OAuth entry points
- `users`: profile and role selection
- `auctions`: auction creation and listing
- `bids`: realtime + HTTP bidding API
- `payments`: payment request orchestration
- `livestream`: Agora stream bootstrap endpoint

## Clean Architecture Mapping
- `modules/*`: application layer (controller/service)
- `shared/domain/*`: domain entities
- `shared/repositories/*`: repository contracts + implementation placeholder
- `shared/contracts/*`: websocket contracts
- `shared/database/*`: MongoDB connection module

## Security Baseline
- Global validation pipe with whitelist
- Centralized exception filter
- Request logging interceptor
- CORS restricted through env variable

## Next Steps
- Implement JWT guards and Google OAuth strategy
- Introduce real repository adapters (MongoDB + Redis)
- Add idempotent payment workflow and webhook handlers
